import { DashboardContainer } from '../container/DashboardContainer';
import type { Player } from '../../domain/player';
import type { Scoreboard } from '../../domain/scoreboard';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onReset: () => void;
  onEndMatch: (board: Scoreboard) => void;
}>;

/**
 * 対局画面のエントリーポイント。
 * DashboardContainer を配置するのみで、自身は状態を持たない。
 */
export const DashboardScreen = ({ players, onReset, onEndMatch }: Props) => (
  <DashboardContainer players={players} onReset={onReset} onEndMatch={onEndMatch} />
);
