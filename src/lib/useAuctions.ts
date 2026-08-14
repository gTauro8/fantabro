import { useCallback, useEffect, useState } from 'react';
import type { Auction } from '../data/types';

const STORAGE_KEY = 'fantabro.auctions.v1';

function readAuctions(): Auction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Auction[]) : [];
  } catch {
    return [];
  }
}

function writeAuctions(auctions: Auction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auctions));
}

function randomId(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>(() => readAuctions());

  useEffect(() => {
    writeAuctions(auctions);
  }, [auctions]);

  const createAuction = useCallback((name: string, teamNames: string[], budgetPerTeam: number) => {
    const auction: Auction = {
      id: randomId('asta-'),
      name,
      budgetPerTeam,
      createdAt: Date.now(),
      teams: teamNames
        .map((n) => n.trim())
        .filter(Boolean)
        .map((n) => ({ id: randomId('team-'), name: n, picks: [] })),
    };
    setAuctions((prev) => [...prev, auction]);
    return auction;
  }, []);

  const deleteAuction = useCallback((id: string) => {
    setAuctions((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAuction = useCallback((id: string, updater: (a: Auction) => Auction) => {
    setAuctions((prev) => prev.map((a) => (a.id === id ? updater(a) : a)));
  }, []);

  return { auctions, createAuction, deleteAuction, updateAuction };
}

export function assignPlayer(auction: Auction, teamId: string, playerId: string, price: number): Auction {
  return {
    ...auction,
    teams: auction.teams.map((t) =>
      t.id === teamId
        ? { ...t, picks: [...t.picks.filter((p) => p.playerId !== playerId), { playerId, price }] }
        : { ...t, picks: t.picks.filter((p) => p.playerId !== playerId) },
    ),
  };
}

export function unassignPlayer(auction: Auction, playerId: string): Auction {
  return {
    ...auction,
    teams: auction.teams.map((t) => ({ ...t, picks: t.picks.filter((p) => p.playerId !== playerId) })),
  };
}

export function spentByTeam(team: Auction['teams'][number]): number {
  return team.picks.reduce((sum, p) => sum + p.price, 0);
}
