import type { DepartmentBench } from '../data/lineups';
import { ROLE_LABEL, type Role } from '../data/types';
import { Card } from './Card';

const DEPARTMENTS: { role: Role; key: keyof DepartmentBench; color: string }[] = [
  { role: 'POR', key: 'goalkeepers', color: '#3987e5' },
  { role: 'DIF', key: 'defenders', color: '#199e70' },
  { role: 'CEN', key: 'midfielders', color: '#c98500' },
  { role: 'ATT', key: 'forwards', color: '#d95926' },
];

export function BenchDepth({ bench }: { bench?: DepartmentBench }) {
  if (!bench) {
    return (
      <Card>
        <p className="text-sm text-[var(--text-dim)]">
          Panchina per reparto non ancora verificata per questa squadra.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-[var(--text)]">Panchina per Reparto</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DEPARTMENTS.map(({ role, key, color }) => {
          const names = bench[key];
          return (
            <div key={role} className="rounded-lg border border-[var(--border-soft)] p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {ROLE_LABEL[role]}
              </p>
              {!names || names.length === 0 ? (
                <p className="text-[11px] text-[var(--text-faint)]">n.d.</p>
              ) : (
                <ol className="space-y-1">
                  {names.map((name, i) => (
                    <li key={name} className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                      <span className="text-[10px] font-bold text-[var(--text-faint)]">
                        {i + 1}°
                      </span>
                      <span className="text-[var(--text)]">{name}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
