import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { activeListone, type ListonePlayer } from '../data/listone';
import { ROLE_LABEL, type Role } from '../data/types';
import { Card } from './Card';

const ROLES: Role[] = ['POR', 'DIF', 'CEN', 'ATT'];
// Colori validati (dataviz skill: banda di luminosità dark + separazione CVD)
// per la superficie scura dell'app. Mostrati un ruolo alla volta: nessun
// confronto simultaneo, quindi ogni singolo colore basta a superare il check.
const ROLE_COLOR: Record<Role, string> = {
  POR: '#3987e5',
  DIF: '#199e70',
  CEN: '#c98500',
  ATT: '#d95926',
};

export function PriceValueChart() {
  const [role, setRole] = useState<Role>('ATT');
  const [search, setSearch] = useState('');

  const byRole = useMemo(() => {
    const map = new Map<Role, ListonePlayer[]>();
    for (const r of ROLES) map.set(r, []);
    for (const p of activeListone) {
      if (p.price <= 0 && p.fvm <= 0) continue;
      map.get(p.role)!.push(p);
    }
    return map;
  }, []);

  const q = search.trim().toLowerCase();

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]">Prezzo vs FVM</h2>
          <p className="text-[11px] text-[var(--text-faint)]">
            I punti sopra la diagonale ideale sono i migliori value pick: FVM alto a fronte di un
            prezzo contenuto.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Evidenzia giocatore…"
            className="w-40 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-emerald-500/50 focus:outline-none"
          />
          <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={clsx(
                  'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                  role === r
                    ? 'text-[var(--text)]'
                    : 'text-[var(--text-dim)] hover:text-[var(--text)]',
                )}
                style={role === r ? { background: `${ROLE_COLOR[r]}26` } : undefined}
              >
                {ROLE_LABEL[r]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-3 flex items-center gap-1.5 text-[11px] text-[var(--text-dim)]">
        <span className="h-2 w-2 rounded-full" style={{ background: ROLE_COLOR[role] }} />
        Mostrando: {ROLE_LABEL[role]} · un ruolo alla volta per una lettura chiara dei colori
      </p>

      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="price"
            name="Prezzo"
            unit=" cr."
            tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
            label={{ value: 'Prezzo (crediti)', position: 'insideBottom', offset: -4, fill: 'var(--text-faint)', fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="fvm"
            name="FVM"
            tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
            label={{ value: 'FVM', angle: -90, position: 'insideLeft', fill: 'var(--text-faint)', fontSize: 11 }}
          />
          <ZAxis range={[40, 41]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: 'var(--border)' }}
            content={<PlayerTooltip />}
          />
          <Scatter
            name={ROLE_LABEL[role]}
            data={byRole.get(role)}
            fill={ROLE_COLOR[role]}
            fillOpacity={0.75}
            shape={(props: unknown) => <HighlightDot {...(props as DotProps)} query={q} />}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface DotProps {
  cx?: number;
  cy?: number;
  fill?: string;
  payload?: ListonePlayer;
}

function HighlightDot({ cx, cy, fill, payload, query }: DotProps & { query: string }) {
  if (cx == null || cy == null || !payload) return null;
  const matched = query.length > 0 && payload.name.toLowerCase().includes(query);
  return (
    <circle
      cx={cx}
      cy={cy}
      r={matched ? 6 : 3}
      fill={matched ? '#ffffff' : fill}
      stroke={matched ? fill : 'var(--surface)'}
      strokeWidth={matched ? 2 : 1}
      opacity={query.length > 0 && !matched ? 0.25 : 1}
    />
  );
}

function PlayerTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ListonePlayer }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-[var(--text)]">{p.name}</p>
      <p className="text-[var(--text-faint)]">
        {p.team} · {p.role}
      </p>
      <p className="mt-1 text-[var(--text-dim)]">
        Prezzo <span className="font-semibold text-[var(--text)]">{p.price}</span> · FVM{' '}
        <span className="font-semibold text-[var(--text)]">{p.fvm}</span>
      </p>
    </div>
  );
}
