import type { AuctionTeam } from '../data/types';
import type { Role } from '../data/types';
import { activeListone, type ListonePlayer } from '../data/listone';

/** Rosa standard Fantacalcio Classic: 25 giocatori totali. */
export const DEFAULT_QUOTA: Record<Role, number> = { POR: 3, DIF: 8, CEN: 8, ATT: 6 };

/** Ripartizione di budget consigliata per ruolo (Sezione F della Knowledge Base). */
export const ROLE_BUDGET_PCT: Record<Role, number> = { POR: 7, DIF: 13, CEN: 30, ATT: 50 };

const ROLES: Role[] = ['POR', 'DIF', 'CEN', 'ATT'];

export interface RoleStrategy {
  role: Role;
  filled: number;
  quota: number;
  remainingSlots: number;
  spentInRole: number;
  targetBudgetForRole: number;
  remainingBudgetForRole: number;
  avgPerRemainingSlot: number;
  overspent: boolean;
  suggestions: ListonePlayer[];
}

export interface TeamStrategy {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  totalRemainingSlots: number;
  roles: RoleStrategy[];
  warnings: string[];
}

export function computeTeamStrategy(
  team: AuctionTeam,
  budgetPerTeam: number,
  availableIds: Set<string>,
  quota: Record<Role, number> = DEFAULT_QUOTA,
): TeamStrategy {
  const spentByRole: Record<Role, number> = { POR: 0, DIF: 0, CEN: 0, ATT: 0 };
  const filledByRole: Record<Role, number> = { POR: 0, DIF: 0, CEN: 0, ATT: 0 };

  for (const pick of team.picks) {
    const player = activeListone.find((p) => p.id === pick.playerId);
    if (!player) continue;
    spentByRole[player.role] += pick.price;
    filledByRole[player.role] += 1;
  }

  const totalSpent = team.picks.reduce((s, p) => s + p.price, 0);
  const totalRemaining = budgetPerTeam - totalSpent;
  const totalRemainingSlots = ROLES.reduce(
    (s, r) => s + Math.max(0, quota[r] - filledByRole[r]),
    0,
  );

  const roles: RoleStrategy[] = ROLES.map((role) => {
    const filled = filledByRole[role];
    const remainingSlots = Math.max(0, quota[role] - filled);
    const targetBudgetForRole = Math.round((budgetPerTeam * ROLE_BUDGET_PCT[role]) / 100);
    const remainingBudgetForRole = targetBudgetForRole - spentByRole[role];
    const overspent = remainingBudgetForRole < 0 && remainingSlots > 0;

    let avgPerRemainingSlot = 0;
    if (remainingSlots > 0) {
      if (remainingBudgetForRole > 0) {
        avgPerRemainingSlot = remainingBudgetForRole / remainingSlots;
      } else if (totalRemaining > 0 && totalRemainingSlots > 0) {
        avgPerRemainingSlot = totalRemaining / totalRemainingSlots;
      }
    }

    const suggestions = remainingSlots === 0
      ? []
      : activeListone
          .filter((p) => p.role === role && availableIds.has(p.id))
          .filter((p) => avgPerRemainingSlot <= 0 || p.price <= Math.max(avgPerRemainingSlot * 1.6, 5))
          .sort((a, b) => b.fvm - a.fvm)
          .slice(0, 5);

    return {
      role,
      filled,
      quota: quota[role],
      remainingSlots,
      spentInRole: spentByRole[role],
      targetBudgetForRole,
      remainingBudgetForRole,
      avgPerRemainingSlot,
      overspent,
      suggestions,
    };
  });

  const warnings: string[] = [];
  for (const r of roles) {
    if (r.overspent) {
      warnings.push(
        `${r.role}: hai già speso oltre il piano (${r.spentInRole} cr. su un target di ${r.targetBudgetForRole} cr.) — restano ${r.remainingSlots} slot da coprire con budget ridotto.`,
      );
    }
  }
  if (totalRemainingSlots > 0 && totalRemaining < totalRemainingSlots) {
    warnings.push(
      `Budget risicato: solo ${totalRemaining} crediti per ${totalRemainingSlots} slot ancora da riempire.`,
    );
  }

  return { totalBudget: budgetPerTeam, totalSpent, totalRemaining, totalRemainingSlots, roles, warnings };
}
