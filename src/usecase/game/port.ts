import type { Player } from '../../domain/player';
import type { ScoreMovement } from '../../domain/movement';
import type { Scoreboard } from '../../domain/scoreboard';

/**
 * ゲーム状態操作の Port。
 *
 * usecase 層が「状態をどう保持し、どう変更するか」という実装詳細
 * (React の useReducer なのか、別の状態管理手段なのか) を知らずに
 * 済むようにするための抽象境界。adapter 層 (例:
 * useGameStateAdapter) がこの Port を実装する。
 */
export type GameStatePort = Readonly<{
  board: Scoreboard;
  canUndo: boolean;
  dispatch: (movement: ScoreMovement) => void;
  undo: () => void;
  reset: (players: ReadonlyArray<Player>) => void;
}>;
