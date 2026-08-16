import type { ScoreMovement } from '../../domain/movement';
import type { GameStatePort } from './port';

/**
 * 点数移動イベントを GameStatePort に委譲して適用する。
 *
 * @param port dispatch を提供する GameStatePort の部分集合。
 * @param movement 適用する点数移動イベント。
 */
export const dispatchMovement = (
  port: Pick<GameStatePort, 'dispatch'>,
  movement: ScoreMovement,
): void => {
  port.dispatch(movement);
};
