import raw from './listone.json';
import type { Role } from './types';

export interface ListonePlayer {
  id: string;
  name: string;
  team: string;
  role: Role;
  roleMantra: string;
  price: number;
  priceInitial: number;
  fvm: number;
  transferredOut: boolean;
}

interface RawListoneEntry {
  id: string;
  name: string;
  team: string;
  role: string;
  roleMantra: string;
  price: number;
  priceInitial: number;
  priceMantra: number;
  priceMantraInitial: number;
  fvm: number;
  fvmMantra: number;
  transferredOut: boolean;
}

const ROLE_MAP: Record<string, Role> = { P: 'POR', D: 'DIF', C: 'CEN', A: 'ATT' };

export const listone: ListonePlayer[] = (raw as RawListoneEntry[]).map((r) => ({
  id: r.id,
  name: r.name,
  team: r.team,
  role: ROLE_MAP[r.role] ?? 'CEN',
  roleMantra: r.roleMantra,
  price: r.price,
  priceInitial: r.priceInitial,
  fvm: r.fvm,
  transferredOut: r.transferredOut,
}));

/** Rosa attiva Serie A 2026/27 (esclude i calciatori ceduti/fuori lega). */
export const activeListone = listone.filter((p) => !p.transferredOut);

export const listoneTeams = [...new Set(activeListone.map((p) => p.team))].sort((a, b) =>
  a.localeCompare(b),
);

export function getListonePlayer(id: string): ListonePlayer | undefined {
  return listone.find((p) => p.id === id);
}

/**
 * Suggerisce alternative ancora disponibili nello stesso ruolo, ordinate per
 * vicinanza di FVM (Fanta Valore di Mercato) al giocatore di riferimento.
 */
export function getAlternatives(
  player: ListonePlayer,
  availableIds: Set<string>,
  count = 3,
): ListonePlayer[] {
  return activeListone
    .filter((p) => p.id !== player.id && p.role === player.role && availableIds.has(p.id))
    .sort((a, b) => Math.abs(a.fvm - player.fvm) - Math.abs(b.fvm - player.fvm))
    .slice(0, count);
}
