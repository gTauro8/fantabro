import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Wand2, RefreshCw, Check } from 'lucide-react';
import type { AuctionTeam, Role } from '../data/types';
import { ROLE_LABEL } from '../data/types';
import { listoneTeams } from '../data/listone';
import { ROLE_BUDGET_PCT } from '../lib/strategy';
import { generateSquad, type GeneratedSquad } from '../lib/squadGenerator';
import { TIER_COLOR } from '../lib/tiers';

const ROLES: Role[] = ['POR', 'DIF', 'CEN', 'ATT'];
const SPENT_COLOR = '#3987e5';
const TARGET_COLOR = '#5c6779';

export function SquadGenerator({
  team,
  budgetPerTeam,
  availableIds,
  onAssignAll,
}: {
  team: AuctionTeam;
  budgetPerTeam: number;
  availableIds: Set<string>;
  onAssignAll: (picks: { playerId: string; price: number }[]) => void;
}) {
  const [preferredTeams, setPreferredTeams] = useState<string[]>([]);
  const [avoidTeams, setAvoidTeams] = useState<string[]>([]);
  const [generated, setGenerated] = useState<GeneratedSquad | null>(null);

  function togglePreferred(t: string) {
    setPreferredTeams((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
    setAvoidTeams((prev) => prev.filter((x) => x !== t));
  }

  function toggleAvoid(t: string) {
    setAvoidTeams((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
    setPreferredTeams((prev) => prev.filter((x) => x !== t));
  }

  function handleGenerate() {
    setGenerated(
      generateSquad({ team, budgetPerTeam, availableIds, preferredTeams, avoidTeams }),
    );
  }

  function swapPick(pickIndex: number, altIndex: number) {
    if (!generated) return;
    setGenerated((prev) => {
      if (!prev) return prev;
      const picks = [...prev.picks];
      const pick = picks[pickIndex];
      const alt = pick.alternatives[altIndex];
      const remainingAlts = pick.alternatives.filter((_, i) => i !== altIndex);
      picks[pickIndex] = { ...pick, player: alt, alternatives: remainingAlts };
      const newSpend = picks.reduce((s, p) => s + p.player.price, 0);
      const alreadySpent = team.picks.reduce((s, p) => s + p.price, 0);
      return {
        ...prev,
        picks,
        newSpend,
        totalSpent: alreadySpent + newSpend,
        totalRemaining: budgetPerTeam - alreadySpent - newSpend,
      };
    });
  }

  const roleBudgetData = useMemo(() => {
    if (!generated) return [];
    return ROLES.map((role) => {
      const target = Math.round((budgetPerTeam * ROLE_BUDGET_PCT[role]) / 100);
      const spent = generated.picks.filter((p) => p.role === role).reduce((s, p) => s + p.player.price, 0);
      return { role: ROLE_LABEL[role], Target: target, Speso: spent };
    });
  }, [generated, budgetPerTeam]);

  const teamSpendData = useMemo(() => {
    if (!generated) return [];
    const byTeam = new Map<string, number>();
    for (const p of generated.picks) {
      byTeam.set(p.player.team, (byTeam.get(p.player.team) ?? 0) + p.player.price);
    }
    return [...byTeam.entries()]
      .map(([team, spend]) => ({ team, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);
  }, [generated]);

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
            Squadre preferite (peso maggiore)
          </p>
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
            {listoneTeams.map((t) => (
              <button
                key={t}
                onClick={() => togglePreferred(t)}
                className={clsx(
                  'rounded-md border px-2 py-1 text-[11px] font-medium transition-colors',
                  preferredTeams.includes(t)
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-[var(--border-soft)] text-[var(--text-dim)] hover:text-[var(--text)]',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
            Squadre da evitare (escluse)
          </p>
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
            {listoneTeams.map((t) => (
              <button
                key={t}
                onClick={() => toggleAvoid(t)}
                className={clsx(
                  'rounded-md border px-2 py-1 text-[11px] font-medium transition-colors',
                  avoidTeams.includes(t)
                    ? 'border-red-500/40 bg-red-500/10 text-red-400'
                    : 'border-[var(--border-soft)] text-[var(--text-dim)] hover:text-[var(--text)]',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#04140b] transition-colors hover:bg-emerald-400"
      >
        {generated ? <RefreshCw size={15} /> : <Wand2 size={15} />}
        {generated ? 'Rigenera rosa' : 'Genera rosa'}
      </button>

      {generated && (
        <div className="space-y-6">
          {generated.warnings.length > 0 && (
            <div className="space-y-1.5">
              {generated.warnings.map((w) => (
                <p key={w} className="rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-300">
                  {w}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="Nuova spesa" value={`${generated.newSpend} cr.`} />
            <MiniStat label="Totale speso" value={`${generated.totalSpent} cr.`} />
            <MiniStat
              label="Rimanente"
              value={`${generated.totalRemaining} cr.`}
              tone={generated.totalRemaining < 0 ? 'bad' : 'good'}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--text)]">Budget per ruolo</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={roleBudgetData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="role" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Target" fill={TARGET_COLOR} radius={[3, 3, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="Speso" fill={SPENT_COLOR} radius={[3, 3, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--text)]">Spesa per squadra (top 10)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={teamSpendData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="team"
                    width={70}
                    tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                    formatter={(value) => [`${value} cr.`, 'Spesa']}
                  />
                  <Bar dataKey="spend" fill={SPENT_COLOR} radius={[0, 3, 3, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-[var(--text)]">Rosa generata ({generated.picks.length})</p>
              <button
                onClick={() => onAssignAll(generated.picks.map((p) => ({ playerId: p.player.id, price: p.player.price })))}
                className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20"
              >
                <Check size={12} />
                Assegna tutta la rosa
              </button>
            </div>
            <div className="space-y-1.5">
              {generated.picks.map((pick, i) => (
                <div key={pick.player.id} className="rounded-lg border border-[var(--border-soft)] p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 shrink-0 text-[10px] font-bold text-[var(--text-faint)]">
                        {pick.role}
                      </span>
                      <span className="text-sm font-medium text-[var(--text)]">{pick.player.name}</span>
                      <span className="text-[11px] text-[var(--text-faint)]">{pick.player.team}</span>
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{ color: TIER_COLOR[pick.tier], background: `${TIER_COLOR[pick.tier]}1f` }}
                      >
                        {pick.tier}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text)]">{pick.player.price} cr.</span>
                  </div>
                  {pick.alternatives.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-10">
                      <span className="text-[10px] text-[var(--text-faint)]">Alternative:</span>
                      {pick.alternatives.map((alt, altIdx) => (
                        <button
                          key={alt.id}
                          onClick={() => swapPick(i, altIdx)}
                          className="rounded-md border border-[var(--border-soft)] px-2 py-0.5 text-[10px] text-[var(--text-dim)] hover:border-emerald-500/40 hover:text-emerald-400"
                        >
                          {alt.name} ({alt.price}cr)
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'bad' }) {
  return (
    <div className="rounded-lg bg-[var(--bg-elevated)] px-2.5 py-2 text-center">
      <p className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">{label}</p>
      <p
        className={
          'text-sm font-bold ' +
          (tone === 'bad' ? 'text-red-400' : tone === 'good' ? 'text-emerald-400' : 'text-[var(--text)]')
        }
      >
        {value}
      </p>
    </div>
  );
}
