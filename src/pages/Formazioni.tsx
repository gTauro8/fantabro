import { useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle } from 'lucide-react';
import { teams } from '../data/teams';
import { getLineup } from '../data/lineups';
import { PageHeader, Card } from '../components/Card';
import { PitchLineup } from '../components/PitchLineup';

export function Formazioni() {
  const [teamId, setTeamId] = useState('inter');
  const team = teams.find((t) => t.id === teamId)!;
  const lineup = getLineup(teamId);

  return (
    <div>
      <PageHeader
        title="Probabili Formazioni"
        subtitle="Squadra tipo stimata per l'avvio 2026/27: chi è titolare inamovibile e chi è in ballottaggio."
      />

      <div className="mb-6 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-200/90">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
          Stima aggregata da fonti pubbliche (sosfanta, DAZN, Goal, Fantacalcio-Online) al
          14/08/2026, non è una probabile formazione ufficiale di giornata: usala per capire le
          gerarchie, ma verifica sempre le notizie live prima di una scelta pesante in asta.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setTeamId(t.id)}
            className={clsx(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              teamId === t.id
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)] hover:text-[var(--text)]',
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {lineup ? (
          <PitchLineup lineup={lineup} />
        ) : (
          <Card>
            <p className="text-sm text-[var(--text-dim)]">
              Formazione non disponibile per {team.name}.
            </p>
          </Card>
        )}

        <div className="space-y-4">
          <Card>
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-faint)]">Modulo</p>
            <p className="text-lg font-bold text-[var(--text)]">{lineup?.formation ?? team.formation}</p>
            <p className="mt-1 text-xs text-[var(--text-dim)]">Allenatore: {team.coach}</p>
          </Card>

          {lineup && (
            <Card>
              <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
                Ballottaggi aperti
              </p>
              <p className="text-xs leading-relaxed text-[var(--text-dim)]">{lineup.battles}</p>
            </Card>
          )}

          <Card>
            <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
              Calci piazzati
            </p>
            <p className="text-xs text-[var(--text-dim)]">
              <span className="text-[var(--text-faint)]">Rigori: </span>
              {team.setPieces.penalties ?? '—'}
            </p>
            <p className="mt-1 text-xs text-[var(--text-dim)]">
              <span className="text-[var(--text-faint)]">Punizioni/Corner: </span>
              {team.setPieces.freeKicksCorners ?? '—'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
