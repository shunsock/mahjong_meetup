/**
 * GameStatePort の useReducer 実装 (adapter)。
 *
 * 状態は { initial, history } の 2 つだけで、現在の Scoreboard は
 * replay によって derive される。
 * Undo は history.slice(0, -1) するだけで済むため、
 * 複雑な巻き戻しロジックが不要。
 */

import { useMemo, useReducer } from 'react';
import type { Player } from '../../domain/player';
import type { ScoreMovement } from '../../domain/movement';
import {
  createInitialScoreboard,
  replay,
  type Scoreboard,
} from '../../domain/scoreboard';
import type { GameStatePort } from '../../usecase/game/port';

type GameState = Readonly<{
  initial: Scoreboard;
  history: ReadonlyArray<ScoreMovement>;
}>;

type GameAction =
  | Readonly<{ type: 'dispatch'; movement: ScoreMovement }>
  | Readonly<{ type: 'undo' }>
  | Readonly<{ type: 'reset'; players: ReadonlyArray<Player> }>;

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'dispatch':
      return { ...state, history: [...state.history, action.movement] };
    case 'undo':
      if (state.history.length === 0) return state;
      return { ...state, history: state.history.slice(0, -1) };
    case 'reset':
      return {
        initial: createInitialScoreboard(action.players),
        history: [],
      };
  }
};

export const useGameStateAdapter = (
  players: ReadonlyArray<Player>,
): GameStatePort => {
  const [state, dispatchAction] = useReducer(
    reducer,
    players,
    (initialPlayers): GameState => ({
      initial: createInitialScoreboard(initialPlayers),
      history: [],
    }),
  );

  const board = useMemo(
    () => replay(state.initial, state.history),
    [state.initial, state.history],
  );

  return {
    board,
    canUndo: state.history.length > 0,
    dispatch: (movement) => dispatchAction({ type: 'dispatch', movement }),
    undo: () => dispatchAction({ type: 'undo' }),
    reset: (newPlayers) => dispatchAction({ type: 'reset', players: newPlayers }),
  };
};
