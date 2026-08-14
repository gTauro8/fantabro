import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Shield, Users, Calculator, Wallet, Radar, Menu, X, Sparkles, Wand2 } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/squadre', label: 'Squadre', icon: Shield },
  { to: '/giocatori', label: 'Giocatori', icon: Users },
  { to: '/sorprese', label: 'Sorprese', icon: Sparkles },
  { to: '/tefr', label: 'Calcolatore TEFR', icon: Calculator },
  { to: '/asta', label: 'Assistente Asta', icon: Wallet },
  { to: '/genera-rosa', label: 'Genera rosa', icon: Wand2 },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)]/60 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500 text-[var(--bg)] shadow-lg shadow-emerald-500/20">
            <Radar size={17} strokeWidth={2.5} />
          </div>
          <p className="text-sm font-bold tracking-tight text-[var(--text)]">FantaBro</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Apri menu"
          className="rounded-lg p-2 text-[var(--text-dim)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
        >
          <Menu size={20} />
        </button>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] transition-transform duration-200 md:sticky md:top-0 md:z-0 md:h-screen md:w-64 md:max-w-none md:translate-x-0 md:bg-[var(--bg-elevated)]/60 md:backdrop-blur-sm',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
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
          <button
            onClick={() => setOpen(false)}
            aria-label="Chiudi menu"
            className="rounded-lg p-1.5 text-[var(--text-faint)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] md:hidden"
          >
            <X size={18} />
          </button>
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

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
