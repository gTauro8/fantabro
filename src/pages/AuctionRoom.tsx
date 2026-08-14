import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft, Check, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { Card } from '../components/Card';
import { StrategyPanel } from '../components/StrategyPanel';
import { activeListone, getAlternatives, type ListonePlayer } from '../data/listone';
import { ROLE_LABEL, type Role } from '../data/types';
import { assignPlayer, spentByTeam, unassignPlayer, useAuctions } from '../lib/useAuctions';

const ROLES: Role[] = ['POR', 'DIF', 'CEN', 'ATT'];
const ROLE_COLOR: Record<Role, string> = {
  POR: '#38bdf8',
  DIF: '#a78bfa',
  CEN: '#fbbf24',
  ATT: '#22c55e',
};

const serieATeams = [...new Set(activeListone.map((p) => p.team))].sort((a, b) => a.localeCompare(b));

export function AuctionRoom() {
  const { id } = useParams<{ id: string }>();
  const { auctions, updateAuction } = useAuctions();
  const auction = auctions.find((a) => a.id === id);

  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showAssigned, setShowAssigned] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [assignTarget, setAssignTarget] = useState<ListonePlayer | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [expandedTab, setExpandedTab] = useState<'strategia' | 'rosa'>('strategia');

  const assignedMap = useMemo(() => {
    const map = new Map<string, { teamId: string; teamName: string; price: number }>();
    if (!auction) return map;
    for (const team of auction.teams) {
      for (const pick of team.picks) {
        map.set(pick.playerId, { teamId: team.id, teamName: team.name, price: pick.price });
      }
    }
    return map;
  }, [auction]);

  const availableIds = useMemo(() => {
    const ids = new Set(activeListone.map((p) => p.id));
    for (const id of assignedMap.keys()) ids.delete(id);
    return ids;
  }, [assignedMap]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeListone
      .filter((p) => (roleFilter === 'ALL' ? true : p.role === roleFilter))
      .filter((p) => (teamFilter === 'ALL' ? true : p.team === teamFilter))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .filter((p) => (showAssigned ? true : availableIds.has(p.id)))
      .sort((a, b) => b.fvm - a.fvm);
  }, [roleFilter, teamFilter, search, showAssigned, availableIds]);

  const focusedPlayer = focusedId ? activeListone.find((p) => p.id === focusedId) ?? null : null;

  const bestPerRole = useMemo(() => {
    if (focusedPlayer) return [];
    return ROLES.map((role) => {
      const best = activeListone
        .filter((p) => p.role === role && availableIds.has(p.id))
        .sort((a, b) => b.fvm - a.fvm)[0];
      return best ? { role, player: best } : null;
    }).filter(Boolean) as { role: Role; player: ListonePlayer }[];
  }, [focusedPlayer, availableIds]);

  const alternatives = focusedPlayer ? getAlternatives(focusedPlayer, availableIds, 3) : [];

  if (!auction) {
    return (
      <div>
        <p className="mb-3 text-sm text-[var(--text-dim)]">Asta non trovata.</p>
        <Link to="/asta" className="text-sm text-emerald-400">
          Torna alle mie aste
        </Link>
      </div>
    );
  }

  const auctionId = auction.id;

  function handleAssign(teamId: string, price: number) {
    if (!assignTarget) return;
    updateAuction(auctionId, (a) => assignPlayer(a, teamId, assignTarget.id, price));
    setFocusedId(assignTarget.id);
    setAssignTarget(null);
  }

  function handleUnassign(playerId: string) {
    updateAuction(auctionId, (a) => unassignPlayer(a, playerId));
  }

  return (
    <div>
      <Link
        to="/asta"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-dim)] hover:text-[var(--text)]"
      >
        <ArrowLeft size={14} />
        Le mie aste
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">{auction.name}</h1>
        <span className="text-xs text-[var(--text-faint)]">
          {assignedMap.size} / {activeListone.length} giocatori assegnati
        </span>
      </div>

      <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
        {auction.teams.map((team) => {
          const spent = spentByTeam(team);
          const remaining = auction.budgetPerTeam - spent;
          return (
            <button
              key={team.id}
              onClick={() => setExpandedTeamId((cur) => (cur === team.id ? null : team.id))}
              className={clsx(
                'flex min-w-[150px] shrink-0 flex-col rounded-xl border px-3.5 py-2.5 text-left transition-colors',
                expandedTeamId === team.id
                  ? 'border-emerald-500/40 bg-[var(--surface-hover)]'
                  : 'border-[var(--border)] bg-[var(--surface)]',
              )}
            >
              <span className="truncate text-xs font-semibold text-[var(--text)]">{team.name}</span>
              <span className="mt-1 text-[11px] text-[var(--text-faint)]">
                {team.picks.length} giocatori
              </span>
              <span
                className={clsx(
                  'mt-1 text-sm font-bold',
                  remaining < 0 ? 'text-red-400' : 'text-emerald-400',
                )}
              >
                {remaining} cr.
              </span>
            </button>
          );
        })}
      </div>

      {expandedTeamId && (() => {
        const team = auction.teams.find((t) => t.id === expandedTeamId);
        if (!team) return null;
        return (
          <Card className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text)]">{team.name}</h3>
              <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
                <button
                  onClick={() => setExpandedTab('strategia')}
                  className={clsx(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    expandedTab === 'strategia'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-[var(--text-dim)] hover:text-[var(--text)]',
                  )}
                >
                  Strategia
                </button>
                <button
                  onClick={() => setExpandedTab('rosa')}
                  className={clsx(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    expandedTab === 'rosa'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-[var(--text-dim)] hover:text-[var(--text)]',
                  )}
                >
                  Rosa ({team.picks.length})
                </button>
              </div>
            </div>

            {expandedTab === 'strategia' ? (
              <StrategyPanel
                team={team}
                budgetPerTeam={auction.budgetPerTeam}
                availableIds={availableIds}
                onSelectPlayer={setFocusedId}
              />
            ) : team.picks.length === 0 ? (
              <p className="text-sm text-[var(--text-dim)]">Nessun giocatore ancora assegnato.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {team.picks.map((pick) => {
                  const pl = activeListone.find((p) => p.id === pick.playerId);
                  if (!pl) return null;
                  return (
                    <div
                      key={pick.playerId}
                      className="flex items-center justify-between rounded-lg border border-[var(--border-soft)] px-3 py-1.5 text-xs"
                    >
                      <span className="text-[var(--text)]">
                        {pl.name} <span className="text-[var(--text-faint)]">({pl.role})</span>
                      </span>
                      <span className="font-semibold text-emerald-400">{pick.price} cr.</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })()}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca giocatore…"
                className="w-52 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 pl-8 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
              {(['ALL', ...ROLES] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={clsx(
                    'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                    roleFilter === r
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-[var(--text-dim)] hover:text-[var(--text)]',
                  )}
                >
                  {r === 'ALL' ? 'Tutti' : ROLE_LABEL[r]}
                </button>
              ))}
            </div>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-xs text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
            >
              <option value="ALL">Tutte le squadre Serie A</option>
              {serieATeams.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
              <input
                type="checkbox"
                checked={showAssigned}
                onChange={(e) => setShowAssigned(e.target.checked)}
                className="accent-emerald-500"
              />
              Mostra assegnati
            </label>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
                  <th className="px-3 py-2.5 font-medium">Calciatore</th>
                  <th className="px-3 py-2.5 font-medium">Sq.</th>
                  <th className="px-3 py-2.5 font-medium">R</th>
                  <th className="px-3 py-2.5 font-medium">Qt.</th>
                  <th className="px-3 py-2.5 font-medium">FVM</th>
                  <th className="px-3 py-2.5 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((p) => {
                  const assigned = assignedMap.get(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setFocusedId(p.id)}
                      className={clsx(
                        'cursor-pointer border-b border-[var(--border-soft)] transition-colors last:border-0 hover:bg-[var(--surface-hover)]',
                        focusedId === p.id && 'bg-[var(--surface-hover)]',
                        assigned && 'opacity-50',
                      )}
                    >
                      <td className="px-3 py-2 font-medium text-[var(--text)]">{p.name}</td>
                      <td className="px-3 py-2 text-[var(--text-dim)]">{p.team}</td>
                      <td className="px-3 py-2">
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                          style={{ color: ROLE_COLOR[p.role], background: `${ROLE_COLOR[p.role]}1f` }}
                        >
                          {p.role}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[var(--text-dim)]">{p.price}</td>
                      <td className="px-3 py-2 font-semibold text-[var(--text)]">{p.fvm}</td>
                      <td className="px-3 py-2">
                        {assigned ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnassign(p.id);
                            }}
                            className="flex items-center gap-1 rounded-md bg-[var(--bg-elevated)] px-2 py-1 text-[11px] text-[var(--text-dim)] hover:text-red-400"
                            title="Annulla assegnazione"
                          >
                            <RotateCcw size={11} />
                            {assigned.teamName} · {assigned.price}cr
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssignTarget(p);
                            }}
                            className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <Check size={11} />
                            Assegna
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length > 200 && (
              <p className="px-3 py-2 text-[11px] text-[var(--text-faint)]">
                Mostrati i primi 200 di {filtered.length} risultati — affina la ricerca o il filtro.
              </p>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-[var(--text)]">
                {focusedPlayer ? 'Alternative suggerite' : 'Migliori disponibili'}
              </h2>
            </div>

            {focusedPlayer ? (
              <div>
                <div className="mb-3 rounded-lg bg-[var(--bg-elevated)] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--text)]">{focusedPlayer.name}</p>
                    <button
                      onClick={() => setFocusedId(null)}
                      className="text-[var(--text-faint)] hover:text-[var(--text)]"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-faint)]">
                    {focusedPlayer.team} · {ROLE_LABEL[focusedPlayer.role]}
                  </p>
                  <div className="mt-2 flex gap-3 text-xs">
                    <span className="text-[var(--text-dim)]">Qt. {focusedPlayer.price}</span>
                    <span className="font-semibold text-[var(--text)]">FVM {focusedPlayer.fvm}</span>
                  </div>
                  {assignedMap.has(focusedPlayer.id) ? (
                    <p className="mt-2 text-[11px] text-amber-400">
                      Già assegnato a {assignedMap.get(focusedPlayer.id)!.teamName}
                    </p>
                  ) : (
                    <button
                      onClick={() => setAssignTarget(focusedPlayer)}
                      className="mt-2 w-full rounded-md bg-emerald-500/15 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/25"
                    >
                      Assegna questo giocatore
                    </button>
                  )}
                </div>

                <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
                  Se ti sfugge, punta su:
                </p>
                {alternatives.length === 0 ? (
                  <p className="text-xs text-[var(--text-faint)]">
                    Nessuna alternativa disponibile nello stesso ruolo.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {alternatives.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => setFocusedId(alt.id)}
                        className="flex w-full items-center justify-between rounded-lg border border-[var(--border-soft)] px-3 py-2 text-left hover:bg-[var(--surface-hover)]"
                      >
                        <div>
                          <p className="text-xs font-medium text-[var(--text)]">{alt.name}</p>
                          <p className="text-[10px] text-[var(--text-faint)]">{alt.team}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-[var(--text)]">FVM {alt.fvm}</p>
                          <p className="text-[10px] text-[var(--text-faint)]">Qt. {alt.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="mb-1 text-[11px] text-[var(--text-faint)]">
                  Clicca un giocatore in tabella per vedere le sue alternative dirette.
                </p>
                {bestPerRole.map(({ role, player }) => (
                  <button
                    key={role}
                    onClick={() => setFocusedId(player.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-[var(--border-soft)] px-3 py-2 text-left hover:bg-[var(--surface-hover)]"
                  >
                    <div>
                      <span
                        className="mr-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                        style={{ color: ROLE_COLOR[role], background: `${ROLE_COLOR[role]}1f` }}
                      >
                        {role}
                      </span>
                      <span className="text-xs font-medium text-[var(--text)]">{player.name}</span>
                      <p className="ml-6 text-[10px] text-[var(--text-faint)]">{player.team}</p>
                    </div>
                    <p className="text-xs font-semibold text-[var(--text)]">FVM {player.fvm}</p>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {assignTarget && (
        <AssignModal
          player={assignTarget}
          teams={auction.teams}
          budgetPerTeam={auction.budgetPerTeam}
          onConfirm={handleAssign}
          onClose={() => setAssignTarget(null)}
        />
      )}
    </div>
  );
}

function AssignModal({
  player,
  teams,
  budgetPerTeam,
  onConfirm,
  onClose,
}: {
  player: ListonePlayer;
  teams: { id: string; name: string; picks: { playerId: string; price: number }[] }[];
  budgetPerTeam: number;
  onConfirm: (teamId: string, price: number) => void;
  onClose: () => void;
}) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [price, setPrice] = useState(player.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text)]">Assegna {player.name}</h3>
          <button onClick={onClose} className="text-[var(--text-faint)] hover:text-[var(--text)]">
            <X size={16} />
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs text-[var(--text-dim)]">Squadra fantacalcio</span>
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
          >
            {teams.map((t) => {
              const spent = t.picks.reduce((s, p) => s + p.price, 0);
              return (
                <option key={t.id} value={t.id}>
                  {t.name} ({budgetPerTeam - spent} cr. rimasti)
                </option>
              );
            })}
          </select>
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs text-[var(--text-dim)]">Prezzo pagato</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
          />
        </label>

        <button
          disabled={!teamId}
          onClick={() => teamId && onConfirm(teamId, price)}
          className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-[#04140b] transition-colors hover:bg-emerald-400 disabled:opacity-50"
        >
          Confirma assegnazione
        </button>
      </div>
    </div>
  );
}
