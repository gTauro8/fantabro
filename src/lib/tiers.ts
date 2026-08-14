import type { ListonePlayer } from '../data/listone';

export type MarketTier = 'Top' | 'Semi-top' | 'Buono' | 'Low-cost' | 'Scommessa';

export const TIER_ORDER: MarketTier[] = ['Top', 'Semi-top', 'Buono', 'Low-cost', 'Scommessa'];

export const TIER_COLOR: Record<MarketTier, string> = {
  Top: '#22c55e',
  'Semi-top': '#38bdf8',
  Buono: '#a78bfa',
  'Low-cost': '#8b96a8',
  Scommessa: '#fbbf24',
};

function tierForRank(rankPct: number): MarketTier {
  if (rankPct < 0.08) return 'Top';
  if (rankPct < 0.25) return 'Semi-top';
  if (rankPct < 0.55) return 'Buono';
  if (rankPct < 0.85) return 'Low-cost';
  return 'Scommessa';
}

/**
 * Calcola una fascia di valore per ciascun giocatore in base al percentile di
 * FVM all'interno del proprio ruolo — non è un giudizio editoriale, ma una
 * stima automatica utile a orientarsi tra tutti i 496 calciatori del listone.
 */
export function computeMarketTiers(list: ListonePlayer[]): Map<string, MarketTier> {
  const byRole = new Map<string, ListonePlayer[]>();
  for (const p of list) {
    if (!byRole.has(p.role)) byRole.set(p.role, []);
    byRole.get(p.role)!.push(p);
  }

  const tiers = new Map<string, MarketTier>();
  for (const group of byRole.values()) {
    const sorted = [...group].sort((a, b) => b.fvm - a.fvm);
    sorted.forEach((p, i) => {
      tiers.set(p.id, tierForRank(i / sorted.length));
    });
  }
  return tiers;
}
