import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import { Card } from '../components/Card';
import { SquadGenerator } from '../components/SquadGenerator';
import { activeListone } from '../data/listone';
import type { AuctionTeam } from '../data/types';
import { assignPlayer, spentByTeam, useAuctions } from '../lib/useAuctions';

const FREEFORM_TEAM: AuctionTeam = { id: 'freeform', name: 'Rosa libera', picks: [] };
const DEFAULT_BUDGET = 500;

export function GenerateSquad() {
  const [params] = useSearchParams();
  const { auctions, updateAuction } = useAuctions();

  const [auctionId, setAuctionId] = useState<string>(params.get('auctionId') ?? '');
  const [teamId, setTeamId] = useState<string>(params.get('teamId') ?? '');
  const [freeBudget, setFreeBudget] = useState(DEFAULT_BUDGET);

  const auction = auctions.find((a) => a.id === auctionId) ?? null;

  useEffect(() => {
    if (!auction) {
      setTeamId('');
      return;
    }
    if (!auction.teams.some((t) => t.id === teamId)) {
      setTeamId(auction.teams[0]?.id ?? '');
    }
  }, [auctionId, auction, teamId]);

  const team = auction ? auction.teams.find((t) => t.id === teamId) ?? null : null;

  const availableIds = useMemo(() => {
    const ids = new Set(activeListone.map((p) => p.id));
    if (auction) {
      for (const t of auction.teams) {
        for (const pick of t.picks) ids.delete(pick.playerId);
      }
    }
    return ids;
  }, [auction]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <Wand2 size={18} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Genera rosa</h1>
          <p className="text-xs text-[var(--text-faint)]">
            Costruisci una rosa completa fuori da un'asta live, o applicala a una squadra di un'asta in corso.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">Base di partenza</p>
            <select
              value={auctionId}
              onChange={(e) => setAuctionId(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
            >
              <option value="">Rosa libera (nessuna asta)</option>
              {auctions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {auction ? (
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">Squadra</p>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
              >
                {auction.teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({auction.budgetPerTeam - spentByTeam(t)} cr. rimanenti)
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">Budget totale</p>
              <input
                type="number"
                min={1}
                value={freeBudget}
                onChange={(e) => setFreeBudget(Math.max(1, Number(e.target.value) || 0))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
          )}
        </div>
        {!auction && (
          <p className="mt-3 text-[11px] text-[var(--text-faint)]">
            Nessuna asta selezionata: la rosa parte da zero slot occupati e usa l'intero listone come disponibile. Per
            assegnare la rosa generata a una squadra reale, seleziona un'asta qui sopra.
          </p>
        )}
      </Card>

      {auction && !team ? (
        <p className="text-sm text-[var(--text-dim)]">Questa asta non ha ancora squadre.</p>
      ) : (
        <Card>
          <SquadGenerator
            key={`${auctionId}:${teamId}`}
            team={team ?? FREEFORM_TEAM}
            budgetPerTeam={auction ? auction.budgetPerTeam : freeBudget}
            availableIds={availableIds}
            onAssignAll={
              auction && team
                ? (picks) => {
                    const validPicks = picks.filter((p) => availableIds.has(p.playerId));
                    updateAuction(auction.id, (a) =>
                      validPicks.reduce((acc, p) => assignPlayer(acc, team.id, p.playerId, p.price), a),
                    );
                  }
                : undefined
            }
          />
        </Card>
      )}
    </div>
  );
}
