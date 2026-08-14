import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, Users, Calculator, Wallet, ArrowRight } from 'lucide-react';
import { teams } from '../data/teams';
import { players } from '../data/players';
import { Card } from '../components/Card';

const topTeams = [...teams].sort((a, b) => b.overall - a.overall).slice(0, 8);

const quickLinks = [
  {
    to: '/squadre',
    icon: Shield,
    title: 'Ranking Squadre',
    desc: '20 squadre valutate su 5 dimensioni: offesa, difesa, bonus, affidabilità tattica.',
  },
  {
    to: '/giocatori',
    icon: Users,
    title: 'Ranking Giocatori',
    desc: 'Top, Value Pick, Scommesse, Low-cost, Rischiosi e Trappole per ogni ruolo.',
  },
  {
    to: '/tefr',
    icon: Calculator,
    title: 'Calcolatore TEFR',
    desc: 'Total Expected Fantasy Rating: FP90, titolarità, fit tattico, costanza, rischio infortunio.',
  },
  {
    to: '/asta',
    icon: Wallet,
    title: 'Assistente Asta',
    desc: 'Allocazione dei 500 crediti per fascia di ruolo, Top-Heavy o Equilibrata.',
  },
];

export function Home() {
  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Serie A Enilive 2026/27
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          Knowledge Base &amp; Sistema di Intelligence Tattico-Statistico
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">
          Dati e modelli per aste, formazioni e scambi basati su xG, xA, PPDA e fit tattico —
          non sui soli gol e assist della stagione precedente.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Squadre analizzate" value={teams.length.toString()} />
        <StatTile label="Giocatori profilati" value={players.length.toString()} />
        <StatTile label="Top team (potenziale)" value={topTeams[0].name} accent="emerald" />
        <StatTile
          label="Nuovi allenatori"
          value="9 / 20"
          hint="Ricambio tecnico stagione 2026/27"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h2 className="mb-4 text-sm font-semibold text-[var(--text)]">
            Potenziale Fanta Complessivo — Top 8 squadre
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topTeams} layout="vertical" margin={{ left: 8, right: 24 }}>
              <XAxis type="number" domain={[0, 10]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text)',
                  fontSize: 12,
                }}
                formatter={(value) => [Number(value).toFixed(1), 'Potenziale']}
              />
              <Bar dataKey="overall" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {topTeams.map((t) => (
                  <Cell key={t.id} fill={t.id === topTeams[0].id ? '#22c55e' : '#22c55e99'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-[var(--text)]">Ricambio tecnico 2026/27</h2>
          <ul className="space-y-3 text-sm text-[var(--text-dim)]">
            <li>
              <span className="font-semibold text-[var(--text)]">Atalanta</span> — Sarri, 4-3-3
              dogmatico.
            </li>
            <li>
              <span className="font-semibold text-[var(--text)]">Milan</span> — Amorim, 3-4-2-1
              posizionale.
            </li>
            <li>
              <span className="font-semibold text-[var(--text)]">Roma</span> — Gasperini, difesa
              a tre e quinti aggressivi.
            </li>
            <li>
              <span className="font-semibold text-[var(--text)]">Napoli</span> — Allegri, 4-3-3
              con De Bruyne al centro.
            </li>
            <li>
              <span className="font-semibold text-[var(--text)]">Como</span> — Fàbregas consolida
              il possesso palla.
            </li>
          </ul>
        </Card>
      </div>

      <h2 className="mb-4 text-sm font-semibold text-[var(--text)]">Esplora la Knowledge Base</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-colors group-hover:border-emerald-500/40 group-hover:bg-[var(--surface-hover)]">
              <Icon size={20} className="mb-3 text-emerald-400" strokeWidth={2} />
              <p className="mb-1 flex items-center gap-1 text-sm font-semibold text-[var(--text)]">
                {title}
                <ArrowRight
                  size={14}
                  className="translate-x-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                />
              </p>
              <p className="text-xs leading-relaxed text-[var(--text-dim)]">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: 'emerald';
}) {
  return (
    <Card>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-faint)]">
        {label}
      </p>
      <p
        className={
          'mt-1.5 text-xl font-bold tracking-tight ' +
          (accent === 'emerald' ? 'text-emerald-400' : 'text-[var(--text)]')
        }
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">{hint}</p>}
    </Card>
  );
}
