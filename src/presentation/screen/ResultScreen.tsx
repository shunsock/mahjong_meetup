import { ResultContainer } from '../container/ResultContainer';
import type { Scoreboard } from '../../domain/scoreboard';
import type { FinalScoreConfig } from '../../domain/final-score';

type Props = Readonly<{
  board: Scoreboard;
  config: FinalScoreConfig;
  onBackToSetup: () => void;
}>;

/**
 * 対戦結果画面のエントリーポイント。
 * ResultContainer を配置するのみで、自身は状態を持たない。
 */
export const ResultScreen = ({ board, config, onBackToSetup }: Props) => (
  <ResultContainer board={board} config={config} onBackToSetup={onBackToSetup} />
);
