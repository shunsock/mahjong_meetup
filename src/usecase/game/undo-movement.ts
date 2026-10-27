import type { GameStatePort } from './port';

/**
 * 直前の点数移動イベントを取り消す。
 *
 * @param port undo を提供する GameStatePort の部分集合。
 */
export const undoMovement = (port: Pick<GameStatePort, 'undo'>): void => {
  port.undo();
};
