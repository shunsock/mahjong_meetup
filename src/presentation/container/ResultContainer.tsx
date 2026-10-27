import type { Scoreboard } from '../../domain/scoreboard';
import type { FinalScoreConfig } from '../../domain/final-score';
import { rankFinalScores } from '../../usecase/result/rank-final-scores';
import { ResultLayout } from '../layout/ResultLayout';

type Props = Readonly<{
  board: Scoreboard;
  config: FinalScoreConfig;
  onBackToSetup: () => void;
}>;

/**
 * 対戦結果画面の算出を担う。rankFinalScores で順位・最終得点を求め、
 * ResultLayout へ表示用の値として渡す。
 */
export const ResultContainer = ({ board, config, onBackToSetup }: Props) => {
  const ranked = rankFinalScores(board, config).map((entry) => ({
    id: entry.player.id,
    name: entry.player.name,
    score: entry.score,
    rank: entry.rank,
    finalScore: entry.finalScore,
  }));

  return (
    <ResultLayout
      ranked={ranked}
      config={config}
      onBackToSetup={onBackToSetup}
    />
  );
};
