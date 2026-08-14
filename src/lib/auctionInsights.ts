import { breakouts } from '../data/breakouts';
import { players } from '../data/players';
import type { Breakout, Player } from '../data/types';

export interface AuctionInsights {
  breakoutByListoneId: Map<string, Breakout>;
  curatedByListoneId: Map<string, Player>;
}

/**
 * Indici inversi listone→(sorpresa | scheda curata), calcolati una sola volta,
 * per mostrare in tempo reale durante l'asta le "Sorprese" e le note/rischi
 * già raccolti altrove nell'app senza doverli cercare a mano.
 */
export function buildAuctionInsights(): AuctionInsights {
  const breakoutByListoneId = new Map<string, Breakout>();
  for (const b of breakouts) {
    if (b.market?.listoneId) breakoutByListoneId.set(b.market.listoneId, b);
  }

  const curatedByListoneId = new Map<string, Player>();
  for (const p of players) {
    if (p.market?.listoneId) curatedByListoneId.set(p.market.listoneId, p);
  }

  return { breakoutByListoneId, curatedByListoneId };
}
