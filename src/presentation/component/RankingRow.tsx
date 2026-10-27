import { ChevronsUp, ChevronsDown } from 'lucide-react';

type Props = Readonly<{
  name: string;
  score: number;
  rank: number;
  finalScore: number;
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

const formatScore = (score: number): string =>
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

/**
 * 対戦結果画面の 1 行分。順位・プレイヤー名・持ち点・最終得点を表示する。
 */
export const RankingRow = ({ name, score, rank, finalScore }: Props) => (
  <div
    className={`flex items-center rounded-2xl bg-neutral-900 px-8 py-6 ring-1 ${rankRingColor(rank)}`}
  >
    <div className={`w-24 text-center font-serif text-4xl font-bold ${rankColor(rank)}`}>
      {rankLabel(rank)}
    </div>

    <div className="ml-6 min-w-0 flex-1">
      <div className="truncate text-3xl text-neutral-300">
        {name}
      </div>
    </div>

    <div className="ml-4">
      <div
        className={`font-mono text-4xl font-bold tabular-nums ${
          score < 0 ? 'text-red-400' : 'text-neutral-50'
        }`}
      >
        {formatScore(score)}
      </div>
      <div
        className={`mt-1 flex items-center gap-1 font-mono text-2xl font-bold tabular-nums ${finalScoreColor(finalScore)}`}
      >
        {finalScore > 0 && <ChevronsUp size={24} />}
        {finalScore < 0 && <ChevronsDown size={24} />}
        <span className="text-lg">{finalScoreSign(finalScore)}</span>
        {formatFinalScoreValue(finalScore)}
      </div>
    </div>
  </div>
);
