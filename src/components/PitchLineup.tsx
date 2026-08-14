import type { Lineup } from '../data/lineups';

function PlayerChip({ name }: { name: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <div className="h-2.5 w-2.5 rounded-full border-2 border-white/80 bg-white/20 shadow" />
      <span className="max-w-[5.5rem] truncate rounded-md bg-black/45 px-1.5 py-0.5 text-center text-[10px] font-medium text-white sm:max-w-[7rem] sm:text-[11px]">
        {name}
      </span>
    </div>
  );
}

function PitchRow({ players }: { players: string[] }) {
  return (
    <div className="flex w-full items-start justify-evenly px-2">
      {players.map((name) => (
        <PlayerChip key={name} name={name} />
      ))}
    </div>
  );
}

export function PitchLineup({ lineup }: { lineup: Lineup }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--border)]"
      style={{
        background:
          'repeating-linear-gradient(0deg, #1a6b34, #1a6b34 40px, #1c7238 40px, #1c7238 80px)',
      }}
    >
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/25" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
      <div className="absolute inset-x-10 top-0 h-10 rounded-b-2xl border border-t-0 border-white/25" />
      <div className="absolute inset-x-10 bottom-0 h-10 rounded-t-2xl border border-b-0 border-white/25" />

      <div className="relative flex flex-col justify-between gap-6 px-2 py-6 sm:gap-8 sm:py-8" style={{ minHeight: 420 }}>
        <PitchRow players={lineup.forwards} />
        {lineup.attackingMid && <PitchRow players={lineup.attackingMid} />}
        <PitchRow players={lineup.midfielders} />
        <PitchRow players={lineup.defenders} />
        <PitchRow players={[lineup.goalkeeper]} />
      </div>
    </div>
  );
}
