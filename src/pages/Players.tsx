import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { players } from '../data/players';
import type { PlayerCategory, Role } from '../data/types';
import { ROLE_LABEL } from '../data/types';
import { PageHeader, Card } from '../components/Card';
import { CategoryBadge } from '../components/CategoryBadge';
import { RiskBadge } from '../components/RiskBadge';
import { ListoneBrowser } from '../components/ListoneBrowser';
import { PriceValueChart } from '../components/PriceValueChart';
import { activeListone } from '../data/listone';

const ROLES: Role[] = ['POR', 'DIF', 'CEN', 'ATT'];
const CATEGORY_ORDER: PlayerCategory[] = [
  'Top',
  'Value Pick',
  'Scommessa',
  'Low-cost',
  'Rischioso',
  'Trappola',
];

type ViewMode = 'curata' | 'listone';

export function Players() {
  const [view, setView] = useState<ViewMode>('curata');
  const [role, setRole] = useState<Role>('ATT');
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const byRole = players.filter(
      (p) => p.role === role && p.name.toLowerCase().includes(query.toLowerCase()),
    );
    const map = new Map<PlayerCategory, typeof players>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const pl of byRole) map.get(pl.category)!.push(pl);
    return map;
  }, [role, query]);

  return (
    <div>
      <PageHeader
        title="Ranking Giocatori"
        subtitle={
          view === 'curata'
            ? 'Suddivisione per ruolo e categoria funzionale: rendimento atteso, affidabilità di minutaggio, titolarità sui piazzati, rischio infortuni/competizione interna.'
            : `Tutti i ${activeListone.length} calciatori del listone ufficiale Fantacalcio.it 2026/27, con fasce di valore calcolate dal FVM.`
        }
      />

      <div className="mb-6 flex gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1" style={{ width: 'fit-content' }}>
        <button
          onClick={() => setView('curata')}
          className={clsx(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            view === 'curata'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          Analisi Curata
        </button>
        <button
          onClick={() => setView('listone')}
          className={clsx(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            view === 'listone'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          Listone Completo ({activeListone.length})
        </button>
      </div>

      {view === 'listone' ? (
        <div className="space-y-6">
          <PriceValueChart />
          <ListoneBrowser />
        </div>
      ) : (
        <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={clsx(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                role === r
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]',
              )}
            >
              {ROLE_LABEL[r]}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca giocatore…"
          className="w-56 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-emerald-500/50 focus:outline-none"
        />
      </div>

      <div className="space-y-8">
        {CATEGORY_ORDER.map((cat) => {
          const list = grouped.get(cat) ?? [];
          if (list.length === 0) return null;
          return (
            <div key={cat}>
              <div className="mb-3 flex items-center gap-2">
                <CategoryBadge category={cat} />
                <span className="text-xs text-[var(--text-faint)]">{list.length} giocatori</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((pl) => (
                  <Card key={pl.id} className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{pl.name}</p>
                        <p className="text-xs text-[var(--text-faint)]">
                          {pl.team}
                          {pl.teamCorrected && (
                            <span className="ml-1 text-amber-400" title="Squadra aggiornata rispetto al listone ufficiale">
                              (agg.)
                            </span>
                          )}
                        </p>
                      </div>
                      <RiskBadge risk={pl.risk} />
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--text-dim)]">{pl.note}</p>
                    {pl.market ? (
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="font-semibold text-emerald-400">{pl.market.price} cr.</span>
                        <span className="text-[var(--text-faint)]">FVM {pl.market.fvm}</span>
                      </div>
                    ) : pl.pendingSync ? (
                      <p className="text-[11px] font-medium text-amber-400">
                        ⏳ trasferimento confermato, in attesa di sync nel listone ufficiale
                      </p>
                    ) : (
                      <p className="text-[11px] font-medium text-red-400">
                        ⚠ non presente nel listone ufficiale 2026/27 — verificare
                      </p>
                    )}
                    {pl.projection && (
                      <div className="mt-1 grid grid-cols-2 gap-2 rounded-lg bg-[var(--bg-elevated)] p-2 text-[11px]">
                        <Stat label="Gol proiez." value={`${pl.projection.goalsRange[0]}-${pl.projection.goalsRange[1]}`} />
                        <Stat label="Assist proiez." value={`${pl.projection.assistsRange[0]}-${pl.projection.assistsRange[1]}`} />
                        <Stat label="xG90" value={pl.projection.xG90.toFixed(2)} />
                        <Stat label="xA90" value={pl.projection.xA90.toFixed(2)} />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        {[...grouped.values()].every((l) => l.length === 0) && (
          <p className="text-sm text-[var(--text-dim)]">Nessun giocatore trovato.</p>
        )}
      </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[var(--text-faint)]">{label}</p>
      <p className="font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}
