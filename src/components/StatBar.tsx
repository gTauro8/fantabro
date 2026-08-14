export function StatBar({
  label,
  value,
  max = 10,
  color = '#22c55e',
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-xs text-[var(--text-dim)]">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--border-soft)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-xs font-semibold text-[var(--text)]">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
