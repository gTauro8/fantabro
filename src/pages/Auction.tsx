import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { PageHeader, Card } from '../components/Card';
import { players } from '../data/players';
import type { Role } from '../data/types';

type Strategy = 'top-heavy' | 'equilibrata';

const ROLE_META: { role: Role; label: string; color: string; min: number; max: number; def: number }[] = [
  { role: 'POR', label: 'Portieri', color: '#38bdf8', min: 6, max: 8, def: 7 },
  { role: 'DIF', label: 'Difesa', color: '#a78bfa', min: 12, max: 15, def: 13 },
  { role: 'CEN', label: 'Centrocampo', color: '#fbbf24', min: 28, max: 32, def: 30 },
  { role: 'ATT', label: 'Attaccanti', color: '#22c55e', min: 48, max: 52, def: 50 },
];

const TOP_HEAVY_PICKS = [
  { name: 'Lautaro Martínez', team: 'Inter', pct: 38 },
  { name: 'Dimarco (o pari fascia)', team: 'Inter', pct: 10 },
  { name: 'Sommer (o pari fascia)', team: 'Inter', pct: 8 },
];

const ROLE_COMPOSITION: Record<Role, string[]> = {
  POR: ['Blocco difesa d\'alta classifica oppure incrocio casa/trasferta ottimizzato'],
  DIF: [
    '1 Top da Modificatore (es. Wesley, Dimarco)',
    '2 Titolari di spinta (es. Miranda, Solet)',
    '5 Completi low-cost',
  ],
  CEN: [
    '2 Semi-top/Titolari da bonus (es. Nico Paz, Pulisic, Orsolini)',
    '3 Regolaristi di rendimento',
    '3 Scommesse',
  ],
  ATT: [
    '1 Top assoluto (es. Lautaro, Malen, Kean)',
    '2 Titolari da doppio spaccato (es. Ramos, Davis)',
    '2 Scommesse ad elevato upside (es. Castro, Bonny)',
    '1 Tappabuchi a 1 credito',
  ],
};

export function Auction() {
  const [budget, setBudget] = useState(500);
  const [strategy, setStrategy] = useState<Strategy>('equilibrata');
  const [pcts, setPcts] = useState<Record<Role, number>>({
    POR: 7,
    DIF: 13,
    CEN: 30,
    ATT: 50,
  });

  const total = pcts.POR + pcts.DIF + pcts.CEN + pcts.ATT;

  const topPicksByRole = useMemo(() => {
    const map: Record<Role, typeof players> = { POR: [], DIF: [], CEN: [], ATT: [] };
    for (const p of players) {
      if (p.category === 'Top' && map[p.role].length < 3) map[p.role].push(p);
    }
    return map;
  }, []);

  function updatePct(role: Role, value: number) {
    setPcts((prev) => ({ ...prev, [role]: value }));
  }

  return (
    <div>
      <PageHeader
        title="Assistente Asta"
        subtitle="Allocazione del budget su base 500 crediti, per fascia di ruolo, secondo le strategie Top-Heavy ed Equilibrata."
      />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-[var(--text-dim)]">
          Budget totale
          <input
            type="number"
            value={budget}
            min={1}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            className="w-24 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
          />
        </label>

        <div className="flex gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
          {(
            [
              { id: 'equilibrata', label: 'Equilibrata (Raccomandata)' },
              { id: 'top-heavy', label: 'Top-Heavy' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setStrategy(s.id)}
              className={clsx(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                strategy === s.id
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {strategy === 'equilibrata' ? (
        <>
          <Card className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text)]">Ripartizione per fascia</h2>
              <span
                className={clsx(
                  'text-xs font-semibold',
                  total > 100 ? 'text-red-400' : 'text-[var(--text-dim)]',
                )}
              >
                Totale: {total}% {total > 100 && '(supera il 100%)'}
              </span>
            </div>

            <div className="mb-5 flex h-8 overflow-hidden rounded-lg border border-[var(--border-soft)]">
              {ROLE_META.map((r) => (
                <div
                  key={r.role}
                  style={{ width: `${pcts[r.role]}%`, background: r.color }}
                  className="flex items-center justify-center text-[10px] font-semibold text-black/80"
                  title={`${r.label}: ${pcts[r.role]}%`}
                >
                  {pcts[r.role] >= 8 ? `${r.label} ${pcts[r.role]}%` : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {ROLE_META.map((r) => (
                <label key={r.role} className="block">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                      {r.label} (consigliato {r.min}-{r.max}%)
                    </span>
                    <span className="text-xs font-semibold text-[var(--text)]">
                      {pcts[r.role]}% · {Math.round((budget * pcts[r.role]) / 100)} cr.
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={1}
                    value={pcts[r.role]}
                    onChange={(e) => updatePct(r.role, Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: r.color }}
                  />
                </label>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {ROLE_META.map((r) => (
              <Card key={r.role}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                    {r.label}
                  </h3>
                  <span className="text-sm font-bold" style={{ color: r.color }}>
                    {Math.round((budget * pcts[r.role]) / 100)} crediti
                  </span>
                </div>
                <ul className="mb-3 space-y-1.5 text-xs text-[var(--text-dim)]">
                  {ROLE_COMPOSITION[r.role].map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
                {topPicksByRole[r.role].length > 0 && (
                  <div className="border-t border-[var(--border-soft)] pt-2">
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--text-faint)]">
                      Target consigliati
                    </p>
                    <p className="text-xs text-[var(--text)]">
                      {topPicksByRole[r.role].map((p) => p.name).join(', ')}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-[var(--text)]">
            Strategia Top-Heavy: oltre il 55% del budget su 3 profili d'élite
          </h2>
          <p className="mb-4 text-xs text-[var(--text-dim)]">
            Rosa completata con regolaristi a basso costo. Picchi di punteggio elevati, ma rosa
            esposta al rischio infortuni sui pilastri.
          </p>
          <div className="space-y-3">
            {TOP_HEAVY_PICKS.map((pick) => (
              <div
                key={pick.name}
                className="flex items-center justify-between rounded-lg border border-[var(--border-soft)] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{pick.name}</p>
                  <p className="text-xs text-[var(--text-faint)]">{pick.team}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">{pick.pct}%</p>
                  <p className="text-xs text-[var(--text-faint)]">
                    {Math.round((budget * pick.pct) / 100)} crediti
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-lg bg-[var(--bg-elevated)] px-4 py-3">
              <p className="text-sm text-[var(--text-dim)]">Budget residuo per il resto della rosa</p>
              <p className="text-sm font-bold text-[var(--text)]">
                {100 - TOP_HEAVY_PICKS.reduce((s, p) => s + p.pct, 0)}% ·{' '}
                {Math.round((budget * (100 - TOP_HEAVY_PICKS.reduce((s, p) => s + p.pct, 0))) / 100)}{' '}
                crediti
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-[var(--text)]">Bias comportamentali da sfruttare</h2>
        <ul className="space-y-2 text-xs leading-relaxed text-[var(--text-dim)]">
          <li>
            <span className="font-semibold text-[var(--text)]">Recency Bias:</span> sopravvalutazione
            di protagonisti di un finale di stagione oltre le aspettative.
          </li>
          <li>
            <span className="font-semibold text-[var(--text)]">Effetto Squadra:</span> le seconde
            linee dei grandi club (es. Frattesi, Zieliński) vengono strapagate rispetto a
            titolari inamovibili di squadre medio-basse con tutti i piazzati (es. Nico Paz,
            Berardi).
          </li>
          <li>
            <span className="font-semibold text-[var(--text)]">Arbitraggio di Posizione:</span>{' '}
            calciatori listati centrocampisti ma impiegati da trequartisti/ali/seconde punte
            (Nico Paz, Pulisic, Zaniolo, Baturina) offrono xG/xA superiori alla media di reparto.
          </li>
        </ul>
      </Card>
    </div>
  );
}
