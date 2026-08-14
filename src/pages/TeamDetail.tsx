import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, ShieldCheck, Flag, Sparkles, TrendingUp } from 'lucide-react';
import { getTeamById, teams } from '../data/teams';
import { players } from '../data/players';
import { Card } from '../components/Card';
import { StatBar } from '../components/StatBar';
import { CategoryBadge } from '../components/CategoryBadge';

export function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const team = getTeamById(id ?? '');

  if (!team) {
    return (
      <div>
        <p className="text-sm text-[var(--text-dim)]">Squadra non trovata.</p>
        <Link to="/squadre" className="text-sm text-emerald-400">
          Torna al ranking squadre
        </Link>
      </div>
    );
  }

  const rank = [...teams].sort((a, b) => b.overall - a.overall).findIndex((t) => t.id === team.id) + 1;
  const roster = players.filter((p) => p.team === team.name);

  return (
    <div>
      <Link
        to="/squadre"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-dim)] hover:text-[var(--text)]"
      >
        <ArrowLeft size={14} />
        Ranking squadre
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            #{rank} in Serie A · {team.formation}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">{team.name}</h1>
          <p className="mt-1 text-sm text-[var(--text-dim)]">Allenatore: {team.coach}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wide text-emerald-400">Potenziale Fanta</p>
          <p className="text-2xl font-bold text-emerald-400">{team.overall.toFixed(1)}</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold text-[var(--text)]">Metriche</h2>
          <div className="space-y-3">
            <StatBar label="Forza Offensiva" value={team.offense} color="#22c55e" />
            <StatBar label="Solidità Difensiva" value={team.defense} color="#38bdf8" />
            <StatBar label="Potenziale Bonus" value={team.bonusPotential} color="#fbbf24" />
            <StatBar label="Affidabilità Tattica" value={team.tacticalReliability} color="#a78bfa" />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle icon={Target} label="Identità Tattica" />
          <p className="text-sm leading-relaxed text-[var(--text-dim)]">{team.identity}</p>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle icon={TrendingUp} label="Produzione Offensiva" />
          <p className="text-sm leading-relaxed text-[var(--text-dim)]">{team.offensiveProduction}</p>
        </Card>
        <Card>
          <SectionTitle icon={ShieldCheck} label="Solidità Difensiva" />
          <p className="text-sm leading-relaxed text-[var(--text-dim)]">{team.defensiveSolidity}</p>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle icon={Flag} label="Calci Piazzati" />
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-[var(--text-faint)]">Rigori: </span>
              <span className="text-[var(--text)]">{team.setPieces.penalties ?? '—'}</span>
            </p>
            <p>
              <span className="text-[var(--text-faint)]">Punizioni / Corner: </span>
              <span className="text-[var(--text)]">{team.setPieces.freeKicksCorners ?? '—'}</span>
            </p>
          </div>
        </Card>
        <Card>
          <SectionTitle icon={Sparkles} label="Impatto Fantacalcio" />
          <p className="text-sm leading-relaxed text-[var(--text-dim)]">{team.fantasyImpact}</p>
        </Card>
      </div>

      {team.fdr && (
        <Card className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">
            FDR Giornate 1-5 —{' '}
            <span className="text-emerald-400">Indice medio {team.fdr.avgFdr.toFixed(1)}</span>
          </h2>
          <p className="mb-3 text-sm text-[var(--text-dim)]">{team.fdr.fixtures}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-emerald-500/10 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-emerald-400">
                Comprare prima
              </p>
              <p className="text-sm text-[var(--text)]">{team.fdr.buyTargets}</p>
            </div>
            <div className="rounded-lg bg-red-500/10 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-red-400">Vendere prima</p>
              <p className="text-sm text-[var(--text)]">{team.fdr.sellTargets}</p>
            </div>
          </div>
        </Card>
      )}

      {roster.length > 0 && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-[var(--text)]">
            Giocatori profilati ({roster.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roster.map((pl) => (
              <div
                key={pl.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border-soft)] px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{pl.name}</p>
                  <p className="text-[11px] text-[var(--text-faint)]">{pl.role}</p>
                </div>
                <CategoryBadge category={pl.category} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: typeof Target; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon size={16} className="text-emerald-400" />
      <h2 className="text-sm font-semibold text-[var(--text)]">{label}</h2>
    </div>
  );
}
