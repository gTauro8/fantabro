import { useState } from 'react';
import clsx from 'clsx';
import { AuctionHub } from './AuctionHub';
import { Auction as BudgetStrategy } from './Auction';

type Tab = 'live' | 'strategy';

export function AuctionPage() {
  const [tab, setTab] = useState<Tab>('live');

  return (
    <div>
      <div className="mb-6 flex gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1" style={{ width: 'fit-content' }}>
        <button
          onClick={() => setTab('live')}
          className={clsx(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            tab === 'live'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          Le mie Aste
        </button>
        <button
          onClick={() => setTab('strategy')}
          className={clsx(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            tab === 'strategy'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          Strategia Budget
        </button>
      </div>

      {tab === 'live' ? <AuctionHub /> : <BudgetStrategy />}
    </div>
  );
}
