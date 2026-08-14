import { activeListone, type ListonePlayer } from '../data/listone';
import type { AuctionTeam, Role } from '../data/types';
import { computeMarketTiers, type MarketTier } from './tiers';
import { buildAuctionInsights, type AuctionInsights } from './auctionInsights';
import { DEFAULT_QUOTA, ROLE_BUDGET_PCT } from './strategy';

const ROLES: Role[] = ['POR', 'DIF', 'CEN', 'ATT'];

/**
 * Tetto massimo di giocatori della stessa squadra reale, anche se preferita:
 * evita la sovra-concentrazione (rischio di correlazione negativa già
 * segnalato altrove nell'app — es. due difensori della stessa squadra media
 * esposti allo stesso malus in caso di sconfitta pesante).
 */
const MAX_PER_TEAM = 5;

/**
 * Tetto massimo di giocatori di fascia Top per singolo reparto: la strategia
 * di riferimento (StrategyPanel) punta a un top per reparto come ancora del
 * reparto, non a più di uno — prenderne un secondo nello stesso reparto
 * userebbe budget che serve altrove nella rosa.
 */
const MAX_TOP_PER_ROLE = 1;

/**
 * Un singolo slot non può assorbire più di questo multiplo della sua quota
 * "equa" di budget di reparto (budget di reparto rimanente / slot rimanenti).
 * Stesso rapporto usato da StrategyPanel per i suggerimenti (budget medio per
 * slot mancante ×1.6): impedisce che il primo giocatore scelto in un reparto
 * esaurisca quasi tutto il budget disponibile, lasciando gli slot successivi
 * riempibili solo con scarti da 1 credito.
 */
const SLOT_FLEX_MULTIPLIER = 1.6;

const TIER_BASE_SCORE: Record<MarketTier, number> = {
  Top: 8,
  'Semi-top': 6,
  Buono: 4,
  'Low-cost': 2,
  Scommessa: 3,
};

const CATEGORY_BONUS: Record<string, number> = {
  Top: 3,
  'Value Pick': 2,
  Scommessa: 1,
  'Low-cost': 0,
  Rischioso: -1,
  Trappola: -3,
};

const RISK_PENALTY: Record<string, number> = {
  Alto: -1.5,
  Medio: -0.5,
  Basso: 0,
};

function computeScore(
  p: ListonePlayer,
  tier: MarketTier,
  insights: AuctionInsights,
  preferredTeams: string[],
): number {
  let score = TIER_BASE_SCORE[tier];
  const curatedPlayer = insights.curatedByListoneId.get(p.id);
  if (curatedPlayer) {
    score += CATEGORY_BONUS[curatedPlayer.category] ?? 0;
    score += RISK_PENALTY[curatedPlayer.risk ?? 'Basso'] ?? 0;
  }
  if (insights.breakoutByListoneId.has(p.id)) score += 1.5;
  if (preferredTeams.includes(p.team)) score *= 1.4;
  return score;
}

export interface SquadGeneratorInput {
  team: AuctionTeam;
  budgetPerTeam: number;
  availableIds: Set<string>;
  preferredTeams: string[];
  avoidTeams: string[];
  quota?: Record<Role, number>;
}

export interface GeneratedPick {
  role: Role;
  player: ListonePlayer;
  tier: MarketTier;
  score: number;
  alternatives: ListonePlayer[];
}

export interface GeneratedSquad {
  picks: GeneratedPick[];
  newSpend: number;
  totalSpent: number;
  totalBudget: number;
  totalRemaining: number;
  warnings: string[];
}

/**
 * Genera una rosa completando gli slot di ruolo ancora mancanti per la
 * squadra, tramite selezione greedy pesata su un punteggio "esperti"
 * (fascia FVM + categoria curata + bonus Sorprese + preferenza di squadra),
 * con un tetto di spesa per slot legato alla quota equa di budget del
 * reparto (vedi SLOT_FLEX_MULTIPLIER, stesso rapporto della StrategyPanel) e
 * un tetto di un giocatore Top per reparto (vedi MAX_TOP_PER_ROLE), per
 * restare su risultati plausibili in un'asta reale a budget condiviso pur
 * puntando comunque a un top per reparto come previsto dalla strategia.
 */
export function generateSquad({
  team,
  budgetPerTeam,
  availableIds,
  preferredTeams,
  avoidTeams,
  quota = DEFAULT_QUOTA,
}: SquadGeneratorInput): GeneratedSquad {
  const insights = buildAuctionInsights();
  const tiers = computeMarketTiers(activeListone);

  const filledByRole: Record<Role, number> = { POR: 0, DIF: 0, CEN: 0, ATT: 0 };
  const spentByRole: Record<Role, number> = { POR: 0, DIF: 0, CEN: 0, ATT: 0 };
  for (const pick of team.picks) {
    const p = activeListone.find((x) => x.id === pick.playerId);
    if (!p) continue;
    filledByRole[p.role] += 1;
    spentByRole[p.role] += pick.price;
  }

  const alreadySpent = team.picks.reduce((s, p) => s + p.price, 0);
  let totalRemaining = budgetPerTeam - alreadySpent;

  const chosenIds = new Set<string>();
  const pickedPerTeam = new Map<string, number>();
  for (const pick of team.picks) {
    const p = activeListone.find((x) => x.id === pick.playerId);
    if (p) pickedPerTeam.set(p.team, (pickedPerTeam.get(p.team) ?? 0) + 1);
  }
  const picks: GeneratedPick[] = [];
  const warnings: string[] = [];

  for (const role of ROLES) {
    const remainingSlots = Math.max(0, quota[role] - filledByRole[role]);
    if (remainingSlots === 0) continue;

    const roleTargetBudget = Math.round((budgetPerTeam * ROLE_BUDGET_PCT[role]) / 100);
    const roleBudget = Math.min(Math.max(0, roleTargetBudget - spentByRole[role]), totalRemaining);

    let topPicksInRole = team.picks.filter((pick) => {
      const p = activeListone.find((x) => x.id === pick.playerId);
      return p && p.role === role && tiers.get(p.id) === 'Top';
    }).length;

    const candidates = activeListone
      .filter((p) => p.role === role)
      .filter((p) => availableIds.has(p.id))
      .filter((p) => !avoidTeams.includes(p.team))
      .map((p) => ({
        player: p,
        tier: tiers.get(p.id) ?? ('Low-cost' as MarketTier),
        score: computeScore(p, tiers.get(p.id) ?? 'Low-cost', insights, preferredTeams),
      }))
      .sort((a, b) => b.score - a.score);

    let budgetLeftForRole = roleBudget;
    let slotsLeft = remainingSlots;

    for (let i = 0; i < remainingSlots; i++) {
      const reserveForRest = slotsLeft - 1;
      const fairShare = budgetLeftForRole / slotsLeft;
      const flexCap = Math.ceil(Math.max(fairShare * SLOT_FLEX_MULTIPLIER, 5));
      const maxSpend = Math.max(1, Math.min(budgetLeftForRole - reserveForRest, flexCap));
      const underTeamCap = (c: (typeof candidates)[number]) =>
        (pickedPerTeam.get(c.player.team) ?? 0) < MAX_PER_TEAM;
      const underTopCap = (c: (typeof candidates)[number]) =>
        c.tier !== 'Top' || topPicksInRole < MAX_TOP_PER_ROLE;

      let choice = candidates.find(
        (c) =>
          !chosenIds.has(c.player.id) &&
          c.player.price <= maxSpend &&
          c.player.price <= totalRemaining &&
          underTeamCap(c) &&
          underTopCap(c),
      );
      if (!choice) {
        choice = candidates
          .filter(
            (c) =>
              !chosenIds.has(c.player.id) &&
              c.player.price <= totalRemaining &&
              underTeamCap(c) &&
              underTopCap(c),
          )
          .sort((a, b) => a.player.price - b.player.price)[0];
      }
      if (!choice) {
        warnings.push(
          `Budget insufficiente o tetto per squadra raggiunto per completare il ruolo ${role} (${slotsLeft} slot rimasti).`,
        );
        break;
      }

      chosenIds.add(choice.player.id);
      pickedPerTeam.set(choice.player.team, (pickedPerTeam.get(choice.player.team) ?? 0) + 1);
      if (choice.tier === 'Top') topPicksInRole += 1;
      budgetLeftForRole -= choice.player.price;
      totalRemaining -= choice.player.price;
      slotsLeft -= 1;

      const alternatives = candidates
        .filter((c) => !chosenIds.has(c.player.id))
        .slice(0, 2)
        .map((c) => c.player);

      picks.push({ role, player: choice.player, tier: choice.tier, score: choice.score, alternatives });
    }

    if (budgetLeftForRole < 0) {
      warnings.push(`${role}: budget di reparto superato di ${Math.abs(budgetLeftForRole)} cr.`);
    }
  }

  const newSpend = picks.reduce((s, p) => s + p.player.price, 0);

  return {
    picks,
    newSpend,
    totalSpent: alreadySpent + newSpend,
    totalBudget: budgetPerTeam,
    totalRemaining,
    warnings,
  };
}
