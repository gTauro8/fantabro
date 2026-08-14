import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';
import { teams } from '../data/teams';
import type { Team } from '../data/types';
import { PageHeader } from '../components/Card';

type SortKey = keyof Pick<
  Team,
  'name' | 'offense' | 'defense' | 'bonusPotential' | 'tacticalReliability' | 'overall'
>;

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Squadra' },
  { key: 'offense', label: 'Forza Offensiva' },
  { key: 'defense', label: 'Solidità Difensiva' },
  { key: 'bonusPotential', label: 'Potenziale Bonus' },
  { key: 'tacticalReliability', label: 'Affidabilità Tattica' },
  { key: 'overall', label: 'Fanta Complessivo' },
];

export function Teams() {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>('overall');
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...teams];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' || typeof bv === 'string') {
        return asc
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      }
      return asc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return copy;
  }, [sortKey, asc]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Ranking Squadre"
        subtitle="20 squadre valutate su cinque dimensioni normalizzate 1-10: Forza Offensiva, Solidità Difensiva, Potenziale Bonus, Affidabilità Tattica e Potenziale Fanta Complessivo."
      />

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
              <th className="px-4 py-3 font-medium">#</th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1 hover:text-[var(--text)]"
                  >
                    {col.label}
                    <ArrowUpDown size={11} className={sortKey === col.key ? 'text-emerald-400' : ''} />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Allenatore</th>
              <th className="px-4 py-3 font-medium">Modulo</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, i) => (
              <tr
                key={team.id}
                onClick={() => navigate(`/squadre/${team.id}`)}
                className="cursor-pointer border-b border-[var(--border-soft)] transition-colors last:border-0 hover:bg-[var(--surface-hover)]"
              >
                <td className="px-4 py-3 text-[var(--text-faint)]">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-[var(--text)]">{team.name}</td>
                <td className="px-4 py-3">
                  <MetricPill value={team.offense} />
                </td>
                <td className="px-4 py-3">
                  <MetricPill value={team.defense} />
                </td>
                <td className="px-4 py-3">
                  <MetricPill value={team.bonusPotential} />
                </td>
                <td className="px-4 py-3">
                  <MetricPill value={team.tacticalReliability} />
                </td>
                <td className="px-4 py-3">
                  <MetricPill value={team.overall} strong />
                </td>
                <td className="px-4 py-3 text-[var(--text-dim)]">{team.coach}</td>
                <td className="px-4 py-3 text-[var(--text-dim)]">{team.formation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricPill({ value, strong }: { value: number; strong?: boolean }) {
  const color = value >= 8.5 ? '#22c55e' : value >= 7 ? '#38bdf8' : '#8b96a8';
  return (
    <span
      className={
        'inline-flex min-w-[2.6rem] justify-center rounded-md px-2 py-0.5 text-xs font-semibold ' +
        (strong ? 'text-sm' : '')
      }
      style={{ color, background: `${color}1f` }}
    >
      {value.toFixed(1)}
    </span>
  );
}
