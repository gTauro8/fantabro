import { AlertTriangle } from 'lucide-react';
import type { AuctionTeam, Role } from '../data/types';
import { ROLE_LABEL } from '../data/types';
import { computeTeamStrategy } from '../lib/strategy';

const ROLE_COLOR: Record<Role, string> = {
  POR: '#3987e5',
  DIF: '#199e70',
  CEN: '#c98500',
  ATT: '#d95926',
};

export function StrategyPanel({
  team,
  budgetPerTeam,
  availableIds,
  onSelectPlayer,
}: {
  team: AuctionTeam;
  budgetPerTeam: number;
  availableIds: Set<string>;
  onSelectPlayer: (playerId: string) => void;
}) {
  const strategy = computeTeamStrategy(team, budgetPerTeam, availableIds);

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <MiniStat label="Speso" value={`${strategy.totalSpent} cr.`} />
        <MiniStat
          label="Rimanente"
          value={`${strategy.totalRemaining} cr.`}
          tone={strategy.totalRemaining < 0 ? 'bad' : 'good'}
        />
        <MiniStat label="Slot mancanti" value={String(strategy.totalRemainingSlots)} />
      </div>

      {strategy.warnings.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {strategy.warnings.map((w) => (
            <p
              key={w}
              className="flex items-start gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-300"
            >
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              {w}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {strategy.roles.map((r) => (
          <div key={r.role} className="rounded-lg border border-[var(--border-soft)] p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
                <span className="h-2 w-2 rounded-full" style={{ background: ROLE_COLOR[r.role] }} />
                {ROLE_LABEL[r.role]}
              </span>
              <span className="text-[11px] text-[var(--text-faint)]">
                {r.filled}/{r.quota} slot
              </span>
            </div>

            {r.remainingSlots === 0 ? (
              <p className="text-[11px] text-emerald-400">Reparto completo.</p>
            ) : (
              <>
                <p className="mb-1.5 text-[11px] text-[var(--text-dim)]">
                  Budget medio consigliato per slot:{' '}
                  <span className="font-semibold text-[var(--text)]">
                    {Math.round(r.avgPerRemainingSlot)} cr.
                  </span>{' '}
                  ({r.remainingSlots} da prendere)
                </p>
                {r.suggestions.length === 0 ? (
                  <p className="text-[11px] text-[var(--text-faint)]">
                    Nessun disponibile in questa fascia di prezzo.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {r.suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onSelectPlayer(s.id)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-[11px] hover:bg-[var(--surface-hover)]"
                      >
                        <span className="truncate text-[var(--text)]">{s.name}</span>
                        <span className="ml-2 shrink-0 text-[var(--text-faint)]">
                          FVM {s.fvm} · {s.price}cr
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'good' | 'bad';
}) {
  return (
    <div className="rounded-lg bg-[var(--bg-elevated)] px-2.5 py-2 text-center">
      <p className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">{label}</p>
      <p
        className={
          'text-sm font-bold ' +
          (tone === 'bad' ? 'text-red-400' : tone === 'good' ? 'text-emerald-400' : 'text-[var(--text)]')
        }
      >
        {value}
      </p>
    </div>
  );
}
