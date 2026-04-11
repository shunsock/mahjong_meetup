import type { Scoreboard } from '../domain/scoreboard';
import type { Player } from '../domain/player';
import type { Points } from '../domain/movement';
import { calcFinalScore, DEFAULT_CONFIG } from '../domain/final-score';

type Props = Readonly<{
  board: Scoreboard;
  onBackToSetup: () => void;
}>;

type RankedResult = Readonly<{
  player: Player;
  score: Points;
  rank: number;
  finalScore: number;
}>;

const rankPlayers = (board: Scoreboard): ReadonlyArray<RankedResult> => {
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
      finalScore: calcFinalScore(entry.score, rank, DEFAULT_CONFIG),
    };
  });
};

const rankLabel = (rank: number): string => {
  switch (rank) {
    case 1: return '1st';
    case 2: return '2nd';
    case 3: return '3rd';
    default: return '4th';
  }
};

const rankAccentColor = (rank: number): string => {
  switch (rank) {
    case 1: return 'text-yellow-400';
    case 2: return 'text-neutral-300';
    case 3: return 'text-amber-600';
    default: return 'text-neutral-500';
  }
};

const rankBorderColor = (rank: number): string => {
  switch (rank) {
    case 1: return 'ring-yellow-400/40';
    case 2: return 'ring-neutral-400/30';
    case 3: return 'ring-amber-600/30';
    default: return 'ring-neutral-700';
  }
};

const formatScore = (score: Points): string =>
  score.toLocaleString('en-US');

const formatFinalScore = (finalScore: number): string => {
  const sign = finalScore > 0 ? '+' : '';
  return `${sign}${finalScore.toFixed(1)}`;
};

const finalScoreColor = (finalScore: number): string => {
  if (finalScore > 0) return 'text-emerald-400';
  if (finalScore < 0) return 'text-red-400';
  return 'text-neutral-500';
};

/**
 * 対戦結果画面。順位・持ち点・得点 (ウマ + 返し反映) を表示する。
 */
export const ResultScreen = ({ board, onBackToSetup }: Props) => {
  const ranked = rankPlayers(board);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-neutral-950 p-6">
      <h1 className="mb-10 text-5xl font-bold text-neutral-100">
        対戦結果
      </h1>

      <div className="w-full max-w-3xl space-y-4">
        {ranked.map((entry) => (
          <div
            key={entry.player.id}
            className={`flex items-center rounded-2xl bg-neutral-900 px-8 py-6 ring-1 ${rankBorderColor(entry.rank)}`}
          >
            <div className={`w-24 text-center font-serif text-4xl font-bold ${rankAccentColor(entry.rank)}`}>
              {rankLabel(entry.rank)}
            </div>

            <div className="ml-6 min-w-0 flex-1">
              <div className="truncate text-3xl font-bold text-neutral-100">
                {entry.player.name}
              </div>
            </div>

            <div className="ml-4 text-right">
              <div
                className={`font-mono text-4xl font-bold tabular-nums ${
                  entry.score < 0 ? 'text-red-400' : 'text-neutral-50'
                }`}
              >
                {formatScore(entry.score)}
              </div>
              <div
                className={`mt-1 font-mono text-2xl font-bold tabular-nums ${finalScoreColor(entry.finalScore)}`}
              >
                {formatFinalScore(entry.finalScore)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-lg text-neutral-500">
        10-30 / 30,000点返し
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
