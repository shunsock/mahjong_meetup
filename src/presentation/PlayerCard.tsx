import type { Player } from '../domain/player';
import type { Points } from '../domain/movement';

type DeltaEntry = Readonly<{
  name: string;
  delta: number;
}>;

type Props = Readonly<{
  player: Player;
  score: Points;
  rank: number;
  deltas: ReadonlyArray<DeltaEntry>;
}>;

const rankLabel = (rank: number): string => {
  switch (rank) {
    case 1: return '一位';
    case 2: return '二位';
    case 3: return '三位';
    default: return '四位';
  }
};

const rankColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return 'text-yellow-400';
    case 4:
      return 'text-red-400';
    default:
      return 'text-neutral-400';
  }
};

const deltaColor = (delta: number): string => {
  if (delta > 0) return 'text-emerald-400';
  if (delta < 0) return 'text-red-400';
  return 'text-neutral-500';
};

const formatScore = (score: Points): string =>
  score.toLocaleString('en-US');

const formatDelta = (delta: number): string => {
  if (delta === 0) return '±0';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toLocaleString('en-US')}`;
};

/**
 * 1 プレイヤー分のカード。点数と他全員との点差を表示する。
 */
export const PlayerCard = ({ player, score, rank, deltas }: Props) => (
  <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center rounded-2xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
    <div className={`font-serif text-3xl font-bold ${rankColor(rank)}`}>
      {rankLabel(rank)}
    </div>
    <div className="mt-2 max-w-full truncate text-2xl text-neutral-300">
      {player.name}
    </div>
    <div
      className={`mt-4 font-mono text-7xl font-bold tabular-nums ${
        score < 0 ? 'text-red-400' : 'text-neutral-50'
      }`}
    >
      {formatScore(score)}
    </div>
    <div className="mt-4 w-full space-y-1">
      {deltas.map((entry) => (
        <div
          key={entry.name}
          className="flex justify-between font-mono text-lg tabular-nums"
        >
          <span className="truncate text-neutral-400">{entry.name}</span>
          <span className={deltaColor(entry.delta)}>
            {formatDelta(entry.delta)}
          </span>
        </div>
      ))}
    </div>
  </div>
);
