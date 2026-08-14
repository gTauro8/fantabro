import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Users, Wallet, ArrowRight, X } from 'lucide-react';
import { PageHeader, Card } from '../components/Card';
import { useAuctions, spentByTeam } from '../lib/useAuctions';

export function AuctionHub() {
  const navigate = useNavigate();
  const { auctions, createAuction, deleteAuction } = useAuctions();
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="Le mie Aste"
        subtitle="Crea una sessione d'asta con le squadre della tua lega: spunta i giocatori assegnati e ricevi sempre un'alternativa suggerita per ogni ruolo."
      />

      <div className="mb-6">
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text-dim)] transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
          >
            <Plus size={16} />
            Nuova asta
          </button>
        ) : (
          <CreateAuctionForm
            onCancel={() => setCreating(false)}
            onCreate={(name, teams, budget) => {
              const a = createAuction(name, teams, budget);
              setCreating(false);
              navigate(`/asta/${a.id}`);
            }}
          />
        )}
      </div>

      {auctions.length === 0 ? (
        <p className="text-sm text-[var(--text-dim)]">
          Nessuna asta creata. Crea la tua prima asta per iniziare il draft live.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((a) => {
            const totalSpent = a.teams.reduce((s, t) => s + spentByTeam(t), 0);
            const totalPicks = a.teams.reduce((s, t) => s + t.picks.length, 0);
            return (
              <Card key={a.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{a.name}</p>
                    <p className="text-[11px] text-[var(--text-faint)]">
                      {new Date(a.createdAt).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteAuction(a.id)}
                    className="text-[var(--text-faint)] hover:text-red-400"
                    title="Elimina asta"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-[var(--text-dim)]">
                  <span className="flex items-center gap-1.5">
                    <Users size={13} /> {a.teams.length} squadre
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet size={13} /> {a.budgetPerTeam} cr. cad.
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-faint)]">
                  {totalPicks} giocatori assegnati · {totalSpent} crediti spesi in totale
                </p>
                <button
                  onClick={() => navigate(`/asta/${a.id}`)}
                  className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  Entra nell'asta
                  <ArrowRight size={14} />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CreateAuctionForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (name: string, teamNames: string[], budget: number) => void;
}) {
  const [name, setName] = useState('Asta Fantacalcio 2026/27');
  const [budget, setBudget] = useState(500);
  const [teamCount, setTeamCount] = useState(8);
  const [teamNames, setTeamNames] = useState<string[]>(
    Array.from({ length: 8 }, (_, i) => `Squadra ${i + 1}`),
  );

  function setCount(n: number) {
    const clamped = Math.max(2, Math.min(20, n));
    setTeamCount(clamped);
    setTeamNames((prev) => {
      const next = [...prev];
      while (next.length < clamped) next.push(`Squadra ${next.length + 1}`);
      return next.slice(0, clamped);
    });
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text)]">Crea nuova asta</h2>
        <button onClick={onCancel} className="text-[var(--text-faint)] hover:text-[var(--text)]">
          <X size={16} />
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-xs text-[var(--text-dim)]">Nome asta</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs text-[var(--text-dim)]">Budget per squadra</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs text-[var(--text-dim)]">Numero squadre</span>
          <input
            type="number"
            min={2}
            max={20}
            value={teamCount}
            onChange={(e) => setCount(Number(e.target.value) || 2)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
          />
        </label>
      </div>

      <p className="mb-2 text-xs text-[var(--text-dim)]">Nomi squadre</p>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {teamNames.map((tn, i) => (
          <input
            key={i}
            value={tn}
            onChange={(e) =>
              setTeamNames((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
            }
            className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs text-[var(--text)] focus:border-emerald-500/50 focus:outline-none"
          />
        ))}
      </div>

      <button
        onClick={() => name.trim() && onCreate(name.trim(), teamNames, budget)}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#04140b] transition-colors hover:bg-emerald-400"
      >
        Crea asta e avvia il draft
      </button>
    </Card>
  );
}
