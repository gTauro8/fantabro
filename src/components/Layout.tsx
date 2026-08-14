import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Shield, Users, Calculator, Wallet, Radar, LayoutGrid } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/squadre', label: 'Squadre', icon: Shield },
  { to: '/formazioni', label: 'Formazioni', icon: LayoutGrid },
  { to: '/giocatori', label: 'Giocatori', icon: Users },
  { to: '/tefr', label: 'Calcolatore TEFR', icon: Calculator },
  { to: '/asta', label: 'Assistente Asta', icon: Wallet },
];

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)]/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-[var(--bg)] shadow-lg shadow-emerald-500/20">
            <Radar size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight tracking-tight text-[var(--text)]">
              FantaBro
            </p>
            <p className="text-[11px] leading-tight text-[var(--text-faint)]">
              Intelligence 2026/27
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-[var(--text-dim)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]',
                )
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--border)] px-6 py-4">
          <p className="text-[11px] leading-relaxed text-[var(--text-faint)]">
            Serie A Enilive 2026/27 — Knowledge Base tattico-statistica per il Fantacalcio.
          </p>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
