import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_0_rgba(255,255,255,0.02)_inset]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-[var(--text-dim)]">{subtitle}</p>}
    </div>
  );
}
