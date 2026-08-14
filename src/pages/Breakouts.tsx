import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Sparkles } from 'lucide-react';
import { breakouts } from '../data/breakouts';
import { ROLE_LABEL, type Role } from '../data/types';
import { PageHeader, Card } from '../components/Card';

const ROLES: Role[] = ['POR', 'DIF', 'CEN', 'ATT'];

export function Breakouts() {
  const [role, setRole] = useState<Role | 'ALL'>('ALL');
  const [query, setQuery] = useState('');

  const teams = useMemo(() => [...new Set(breakouts.map((b) => b.team))].sort(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return breakouts
      .filter((b) => (role === 'ALL' ? true : b.role === role))
      .filter((b) => (q ? b.name.toLowerCase().includes(q) || b.team.toLowerCase().includes(q) : true));
  }, [role, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof breakouts>();
    for (const t of teams) map.set(t, []);
    for (const b of filtered) {
      if (!map.has(b.team)) map.set(b.team, []);
      map.get(b.team)!.push(b);
    }
    return map;
  }, [filtered, teams]);

  return (
    <div>
      <PageHeader
        title="Sorprese"
        subtitle="Giocatori sconosciuti o sottovalutati che potrebbero avere un'ottima stagione: nuovi acquisti, giovani emergenti, rincalzi con più spazio. Raccolti da fonti pubbliche il 14/08/2026 — verifica sempre le notizie live prima dell'asta."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
          {(['ALL', ...ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={clsx(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                role === r
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]',
              )}
            >
              {r === 'ALL' ? 'Tutti' : ROLE_LABEL[r]}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca giocatore o squadra…"
          className="w-56 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-emerald-500/50 focus:outline-none"
        />
        <span className="text-xs text-[var(--text-faint)]">{filtered.length} giocatori</span>
      </div>

      <div className="space-y-8">
        {teams.map((team) => {
          const list = grouped.get(team) ?? [];
          if (list.length === 0) return null;
          return (
            <div key={team}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <Sparkles size={14} className="text-emerald-400" />
                {team}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((b) => (
                  <Card key={b.id} className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[var(--text)]">{b.name}</p>
                      <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-faint)]">
                        {b.role}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--text-dim)]">{b.reason}</p>
                    {b.market && (
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="font-semibold text-emerald-400">{b.market.price} cr.</span>
                        <span className="text-[var(--text-faint)]">FVM {b.market.fvm}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-[var(--text-dim)]">Nessun giocatore trovato.</p>
        )}
      </div>
    </div>
  );
}
