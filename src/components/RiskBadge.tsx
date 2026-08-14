import clsx from 'clsx';
import type { RiskLevel } from '../data/types';

const CLASS_MAP: Record<RiskLevel, string> = {
  Basso: 'risk-basso',
  Medio: 'risk-medio',
  Alto: 'risk-alto',
};

export function RiskBadge({ risk }: { risk?: RiskLevel }) {
  if (!risk) return null;
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        CLASS_MAP[risk],
      )}
    >
      {risk}
    </span>
  );
}
