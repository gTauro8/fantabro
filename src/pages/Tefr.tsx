import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { playersWithProjection } from '../data/players';
import { PageHeader, Card } from '../components/Card';
import { calcTefr, type TefrInputs } from '../lib/tefr';

const DEFAULTS: TefrInputs = {
  xG90: 0.32,
  xA90: 0.2,
  keyPass90: 1.4,
  shotsOnTarget90: 1.1,
  yellowCards90: 0.22,
  vBase: 6.0,
  expectedSeasonMinutes: 2600,
  tacticalFit: 1.1,
  consistency: 0.7,
  injuryRisk: 0.25,
};

const BREAKDOWN_COLORS: Record<string, string> = {
  fp90Weighted: '#22c55e',
  titScoreWeighted: '#38bdf8',
  tacticalFitWeighted: '#a78bfa',
  consistencyWeighted: '#fbbf24',
  injuryRiskWeighted: '#f87171',
};

const BREAKDOWN_LABELS: Record<string, string> = {
  fp90Weighted: 'FP90 (w=0.40)',
  titScoreWeighted: 'Titolarità (w=0.25)',
  tacticalFitWeighted: 'Fit Tattico (w=0.15)',
  consistencyWeighted: 'Costanza (w=0.10)',
  injuryRiskWeighted: 'Rischio Infortunio (w=-0.10)',
};

export function Tefr() {
  const [inputs, setInputs] = useState<TefrInputs>(DEFAULTS);
  const [presetId, setPresetId] = useState<string>('');

  const result = useMemo(() => calcTefr(inputs), [inputs]);

  const breakdownData = useMemo(
    () =>
      Object.entries(result.breakdown).map(([key, value]) => ({
        key,
        label: BREAKDOWN_LABELS[key],
        value,
        color: BREAKDOWN_COLORS[key],
      })),
    [result],
  );

  function update<K extends keyof TefrInputs>(key: K, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function applyPreset(id: string) {
    setPresetId(id);
    const player = playersWithProjection.find((p) => p.id === id);
    if (!player?.projection) return;
    setInputs((prev) => ({
      ...prev,
      xG90: player.projection!.xG90,
      xA90: player.projection!.xA90,
      expectedSeasonMinutes: Number(player.projection!.expectedMinutes.split('-')[1] ?? prev.expectedSeasonMinutes),
    }));
  }

  return (
    <div>
      <PageHeader
        title="Calcolatore TEFR"
        subtitle="Total Expected Fantasy Rating: TEFR = 0.40·FP90 + 0.25·TitScore + 0.15·FitTattico + 0.10·Costanza − 0.10·RischioInfortunio."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text)]">Parametri giocatore</h2>
            <select
              value={presetId}
              onChange={(e) => applyPreset(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
            >
              <option value="">Carica preset giocatore…</option>
              {playersWithProjection.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.team})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Slider label="xG per 90'" value={inputs.xG90} min={0} max={0.8} step={0.01} onChange={(v) => update('xG90', v)} />
            <Slider label="xA per 90'" value={inputs.xA90} min={0} max={0.6} step={0.01} onChange={(v) => update('xA90', v)} />
            <Slider label="Passaggi chiave / 90'" value={inputs.keyPass90} min={0} max={4} step={0.1} onChange={(v) => update('keyPass90', v)} />
            <Slider label="Tiri in porta / 90'" value={inputs.shotsOnTarget90} min={0} max={3} step={0.1} onChange={(v) => update('shotsOnTarget90', v)} />
            <Slider label="Ammonizioni / 90'" value={inputs.yellowCards90} min={0} max={0.5} step={0.01} onChange={(v) => update('yellowCards90', v)} />
            <Slider label="Voto base" value={inputs.vBase} min={5.5} max={6.5} step={0.05} onChange={(v) => update('vBase', v)} />
            <Slider label="Minuti stagionali attesi" value={inputs.expectedSeasonMinutes} min={0} max={3420} step={50} onChange={(v) => update('expectedSeasonMinutes', v)} />
            <Slider label="Fit tattico" value={inputs.tacticalFit} min={0.5} max={1.5} step={0.05} onChange={(v) => update('tacticalFit', v)} />
            <Slider label="Costanza (1 = massima)" value={inputs.consistency} min={0} max={1} step={0.05} onChange={(v) => update('consistency', v)} />
            <Slider label="Rischio infortunio (1 = massimo)" value={inputs.injuryRisk} min={0} max={1} step={0.05} onChange={(v) => update('injuryRisk', v)} />
          </div>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="text-center">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-faint)]">TEFR Score</p>
            <p className="mt-1 text-4xl font-bold text-emerald-400">{result.tefr.toFixed(2)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-left">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">FP90</p>
                <p className="text-lg font-semibold text-[var(--text)]">{result.fp90.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">Tit Score</p>
                <p className="text-lg font-semibold text-[var(--text)]">{result.titScore.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">Contributo componenti</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={breakdownData} layout="vertical" margin={{ left: 8, right: 24 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={140}
                  tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
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
                  formatter={(value) => [Number(value).toFixed(2), 'Contributo']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                  {breakdownData.map((d) => (
                    <Cell key={d.key} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-[var(--text-dim)]">{label}</span>
        <span className="text-xs font-semibold text-[var(--text)]">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500"
      />
    </label>
  );
}
