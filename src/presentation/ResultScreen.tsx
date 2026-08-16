import { ChevronsUp, ChevronsDown } from 'lucide-react';
import { PointStickDivider } from './component/PointStickDivider';
import type { Scoreboard } from '../domain/scoreboard';
import type { Player } from '../domain/player';
import type { Points } from '../domain/movement';
import { calcFinalScore, type FinalScoreConfig } from '../domain/final-score';

type Props = Readonly<{
  board: Scoreboard;
  config: FinalScoreConfig;
  onBackToSetup: () => void;
}>;

type RankedResult = Readonly<{
  player: Player;
  score: Points;
  rank: number;
  finalScore: number;
}>;

const rankPlayers = (
  board: Scoreboard,
  config: FinalScoreConfig,
): ReadonlyArray<RankedResult> => {
  const withScores = board.players.map((player) => ({
    player,
    score: board.scores[player.id],
  }));
  const sorted = [...withScores].sort((a, b) => b.score - a.score);
  return sorted.map((entry, index) => {
    const rank = index + 1;
    return {
      player: entry.player,
      score: entry.score,
      rank,
      finalScore: calcFinalScore(entry.score, rank, config),
    };
  });
};

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
    case 1: return 'text-yellow-400';
    case 4: return 'text-red-400';
    default: return 'text-neutral-400';
  }
};

const rankRingColor = (rank: number): string => {
  switch (rank) {
    case 1: return 'ring-yellow-400';
    default: return 'ring-neutral-800';
  }
};

const formatScore = (score: Points): string =>
  score.toLocaleString('en-US');

const finalScoreSign = (finalScore: number): string => {
  if (finalScore > 0) return '+';
  if (finalScore < 0) return '-';
  return '';
};

const formatFinalScoreValue = (finalScore: number): string =>
  Math.abs(finalScore).toFixed(1);

const finalScoreColor = (finalScore: number): string => {
  if (finalScore > 0) return 'text-emerald-400';
  if (finalScore < 0) return 'text-red-400';
  return 'text-neutral-500';
};

/** ウマ設定を「小-大」形式のラベルにする。 */
const formatUmaLabel = (config: FinalScoreConfig): string => {
  const abs = config.placementBonus.map(Math.abs);
  const min = Math.min(...abs);
  const max = Math.max(...abs);
  return `${min}-${max}`;
};

/**
 * 対戦結果画面。順位・持ち点・得点 (ウマ + 返し反映) を表示する。
 */
export const ResultScreen = ({ board, config, onBackToSetup }: Props) => {
  const ranked = rankPlayers(board, config);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-neutral-950 p-6">
      <h1 className="mb-4 text-5xl font-bold text-neutral-100">
        対戦結果
      </h1>

      <div className="mb-6 w-full max-w-3xl">
        <PointStickDivider />
      </div>

      <div className="w-full max-w-3xl space-y-4">
        {ranked.map((entry) => (
          <div
            key={entry.player.id}
            className={`flex items-center rounded-2xl bg-neutral-900 px-8 py-6 ring-1 ${rankRingColor(entry.rank)}`}
          >
            <div className={`w-24 text-center font-serif text-4xl font-bold ${rankColor(entry.rank)}`}>
              {rankLabel(entry.rank)}
            </div>

            <div className="ml-6 min-w-0 flex-1">
              <div className="truncate text-3xl text-neutral-300">
                {entry.player.name}
              </div>
            </div>

            <div className="ml-4">
              <div
                className={`font-mono text-4xl font-bold tabular-nums ${
                  entry.score < 0 ? 'text-red-400' : 'text-neutral-50'
                }`}
              >
                {formatScore(entry.score)}
              </div>
              <div
                className={`mt-1 flex items-center gap-1 font-mono text-2xl font-bold tabular-nums ${finalScoreColor(entry.finalScore)}`}
              >
                {entry.finalScore > 0 && <ChevronsUp size={24} />}
                {entry.finalScore < 0 && <ChevronsDown size={24} />}
                <span className="text-lg">{finalScoreSign(entry.finalScore)}</span>
                {formatFinalScoreValue(entry.finalScore)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full max-w-3xl">
        <PointStickDivider />
      </div>

      <p className="mt-2 text-lg text-neutral-500">
        {formatUmaLabel(config)} / {config.returnPoint.toLocaleString('en-US')}点返し
      </p>

      <button
        type="button"
        onClick={onBackToSetup}
        className="mt-6 rounded-xl bg-emerald-700 px-16 py-5 text-3xl font-bold text-white transition hover:bg-emerald-600"
      >
        トップに戻る
      </button>
    </div>
  );
};
