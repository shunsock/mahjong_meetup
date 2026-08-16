import { SetupContainer } from '../container/SetupContainer';
import type { Player } from '../../domain/player';
import type { FinalScoreConfig } from '../../domain/final-score';

type Props = Readonly<{
  onStart: (
    players: ReadonlyArray<Player>,
    config: FinalScoreConfig,
  ) => void;
}>;

/**
 * プレイヤー名・ウマオカの入力画面のエントリーポイント。
 * SetupContainer を配置するのみで、自身は状態を持たない。
 */
export const SetupScreen = ({ onStart }: Props) => (
  <SetupContainer onStart={onStart} />
);
