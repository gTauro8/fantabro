import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowUpDown } from 'lucide-react';
import { activeListone, listoneTeams } from '../data/listone';
import { ROLE_LABEL, type Role } from '../data/types';
import { computeMarketTiers, TIER_COLOR, TIER_ORDER, type MarketTier } from '../lib/tiers';

const ROLES: Role[] = ['POR', 'DIF', 'CEN', 'ATT'];
type SortKey = 'name' | 'team' | 'price' | 'fvm';

export function ListoneBrowser() {
  const [role, setRole] = useState<Role | 'ALL'>('ALL');
  const [team, setTeam] = useState('ALL');
  const [tier, setTier] = useState<MarketTier | 'ALL'>('ALL');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('fvm');
  const [asc, setAsc] = useState(false);

  const tiers = useMemo(() => computeMarketTiers(activeListone), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = activeListone
      .filter((p) => (role === 'ALL' ? true : p.role === role))
      .filter((p) => (team === 'ALL' ? true : p.team === team))
      .filter((p) => (tier === 'ALL' ? true : tiers.get(p.id) === tier))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true));

    const sorted = [...list].sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      av = av as number;
      bv = bv as number;
      return asc ? av - bv : bv - av;
    });
    return sorted;
  }, [role, team, tier, query, sortKey, asc, tiers]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca giocatore…"
          className="w-52 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-emerald-500/50 focus:outline-none"
        />

        <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
          {(['ALL', ...ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={clsx(
                'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                role === r
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]',
              )}
            >
              {r === 'ALL' ? 'Tutti' : ROLE_LABEL[r]}
            </button>
          ))}
        </div>

        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-xs text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
        >
          <option value="ALL">Tutte le squadre</option>
          {listoneTeams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as MarketTier | 'ALL')}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-xs text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
        >
          <option value="ALL">Tutte le fasce</option>
          {TIER_ORDER.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <span className="text-xs text-[var(--text-faint)]">{filtered.length} giocatori</span>
      </div>

      <p className="mb-3 text-[11px] text-[var(--text-faint)]">
        Fascia calcolata automaticamente dal percentile di FVM nel proprio ruolo (non è un
        giudizio editoriale) — utile per orientarsi su tutti i 496 calciatori del listone
        ufficiale 2026/27.
      </p>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
              <th className="px-3 py-2.5 font-medium">
                <SortButton label="Calciatore" col="name" active={sortKey} asc={asc} onClick={handleSort} />
              </th>
              <th className="px-3 py-2.5 font-medium">
                <SortButton label="Squadra" col="team" active={sortKey} asc={asc} onClick={handleSort} />
              </th>
              <th className="px-3 py-2.5 font-medium">R</th>
              <th className="px-3 py-2.5 font-medium">Fascia</th>
              <th className="px-3 py-2.5 font-medium">
                <SortButton label="Qt." col="price" active={sortKey} asc={asc} onClick={handleSort} />
              </th>
              <th className="px-3 py-2.5 font-medium">
                <SortButton label="FVM" col="fvm" active={sortKey} asc={asc} onClick={handleSort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 250).map((p) => {
              const t = tiers.get(p.id);
              return (
                <tr
                  key={p.id}
                  className="border-b border-[var(--border-soft)] transition-colors last:border-0 hover:bg-[var(--surface-hover)]"
                >
                  <td className="px-3 py-2 font-medium text-[var(--text)]">{p.name}</td>
                  <td className="px-3 py-2 text-[var(--text-dim)]">{p.team}</td>
                  <td className="px-3 py-2 text-[var(--text-faint)]">{p.role}</td>
                  <td className="px-3 py-2">
                    {t && (
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                        style={{ color: TIER_COLOR[t], background: `${TIER_COLOR[t]}1f` }}
                      >
                        {t}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-[var(--text-dim)]">{p.price}</td>
                  <td className="px-3 py-2 font-semibold text-[var(--text)]">{p.fvm}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        {filtered.length > 250 && (
          <p className="px-3 py-2 text-[11px] text-[var(--text-faint)]">
            Mostrati i primi 250 di {filtered.length} risultati — affina la ricerca o i filtri.
          </p>
        )}
      </div>
    </div>
  );
}

function SortButton({
  label,
  col,
  active,
  asc,
  onClick,
}: {
  label: string;
  col: SortKey;
  active: SortKey;
  asc: boolean;
  onClick: (col: SortKey) => void;
}) {
  return (
    <button onClick={() => onClick(col)} className="flex items-center gap-1 hover:text-[var(--text)]">
      {label}
      <ArrowUpDown size={11} className={active === col ? 'text-emerald-400' : ''} />
      {active === col && <span className="sr-only">{asc ? 'crescente' : 'decrescente'}</span>}
    </button>
  );
}
