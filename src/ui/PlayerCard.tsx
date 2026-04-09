import type { Player } from '../domain/player';
import type { Points } from '../domain/movement';

type Props = Readonly<{
  player: Player;
  score: Points;
  rank: number; // 1〜4
  delta: Points; // トップとの差 (トップは 0、他はマイナス値)
}>;

const rankColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return 'text-yellow-400';
    case 2:
      return 'text-neutral-300';
    case 3:
      return 'text-amber-600';
    default:
      return 'text-neutral-500';
  }
};

const formatScore = (score: Points): string =>
  score.toLocaleString('en-US');

const formatDelta = (delta: Points): string => {
  if (delta === 0) return '±0';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toLocaleString('en-US')}`;
};

/**
 * 1 プレイヤー分のカード。大画面で見やすいよう点数を巨大に表示する。
 */
export const PlayerCard = ({ player, score, rank, delta }: Props) => (
  <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center rounded-2xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
    <div className={`text-3xl font-bold ${rankColor(rank)}`}>
      {rank}位
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
    <div className="mt-2 font-mono text-2xl text-neutral-400 tabular-nums">
      {formatDelta(delta)}
    </div>
  </div>
);
