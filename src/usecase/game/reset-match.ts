import type { Player } from '../../domain/player';
import type { GameStatePort } from './port';

/**
 * 指定したプレイヤー構成で試合の状態をリセットする。
 *
 * @param port reset を提供する GameStatePort の部分集合。
 * @param players リセット後の初期状態に使うプレイヤー一覧。
 */
export const resetMatch = (
  port: Pick<GameStatePort, 'reset'>,
  players: ReadonlyArray<Player>,
): void => {
  port.reset(players);
};
