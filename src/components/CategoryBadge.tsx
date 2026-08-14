import clsx from 'clsx';
import type { PlayerCategory } from '../data/types';

const STYLE_MAP: Record<PlayerCategory, string> = {
  Top: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Value Pick': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  Scommessa: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'Low-cost': 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  Rischioso: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Trappola: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export function CategoryBadge({ category }: { category: PlayerCategory }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        STYLE_MAP[category],
      )}
    >
      {category}
    </span>
  );
}
