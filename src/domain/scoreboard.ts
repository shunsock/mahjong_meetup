/**
 * 持ち点の状態と状態遷移。
 *
 * Scoreboard は immutable。apply は純粋関数であり、
 * replay により任意の履歴から現在の状態を再構築できる。
 * これにより Undo は「履歴末尾を取り除いて replay する」という
 * 宣言的な操作で表現される。
 */

import { PLAYER_IDS, type Player, type PlayerId } from './player';
import type { Points, ScoreMovement } from './movement';
import {
  calcRyukyokuDistribution,
  calcTsumoKoDistribution,
  calcTsumoOyaDistribution,
} from './distribution';

export const INITIAL_POINTS: Points = 25000;

export type ScoreMap = Readonly<Record<PlayerId, Points>>;

export type Scoreboard = Readonly<{
  players: ReadonlyArray<Player>;
  scores: ScoreMap;
}>;

export const createInitialScoreboard = (
  players: ReadonlyArray<Player>,
): Scoreboard => ({
  players,
  scores: {
    p1: INITIAL_POINTS,
    p2: INITIAL_POINTS,
    p3: INITIAL_POINTS,
    p4: INITIAL_POINTS,
  },
});

/** スコアマップに delta を加算した新しいマップを返す。 */
const addScore = (
  scores: ScoreMap,
  playerId: PlayerId,
  delta: Points,
): ScoreMap => ({
  ...scores,
  [playerId]: scores[playerId] + delta,
});

/** 複数プレイヤーへの一括加算。 */
const addScores = (
  scores: ScoreMap,
  deltas: ReadonlyArray<readonly [PlayerId, Points]>,
): ScoreMap =>
  deltas.reduce<ScoreMap>(
    (acc, [playerId, delta]) => addScore(acc, playerId, delta),
    scores,
  );

/**
 * 単一の点数移動イベントをスコアボードに適用する (純粋関数)。
 */
export const apply = (
  board: Scoreboard,
  movement: ScoreMovement,
): Scoreboard => {
  switch (movement.kind) {
    case 'ron':
      return {
        ...board,
        scores: addScores(board.scores, [
          [movement.winner, movement.amount],
          [movement.loser, -movement.amount],
        ]),
      };

    case 'tsumo-ko': {
      const { fromOya, fromKo } = calcTsumoKoDistribution(movement.total);
      const koPayers = PLAYER_IDS.filter(
        (id) => id !== movement.winner && id !== movement.dealer,
      );
      const gained = fromOya + fromKo * koPayers.length;
      return {
        ...board,
        scores: addScores(board.scores, [
          [movement.winner, gained],
          [movement.dealer, -fromOya],
          ...koPayers.map((id) => [id, -fromKo] as const),
        ]),
      };
    }

    case 'tsumo-oya': {
      const { fromKo } = calcTsumoOyaDistribution(movement.total);
      const koPayers = PLAYER_IDS.filter((id) => id !== movement.winner);
      const gained = fromKo * koPayers.length;
      return {
        ...board,
        scores: addScores(board.scores, [
          [movement.winner, gained],
          ...koPayers.map((id) => [id, -fromKo] as const),
        ]),
      };
    }

    case 'ryukyoku': {
      const { receivePerTenpai, payPerNoten } = calcRyukyokuDistribution(
        movement.tenpai.length,
      );
      if (receivePerTenpai === 0 && payPerNoten === 0) {
        return board;
      }
      const tenpaiSet = new Set<PlayerId>(movement.tenpai);
      const deltas: ReadonlyArray<readonly [PlayerId, Points]> = PLAYER_IDS.map(
        (id) =>
          [id, tenpaiSet.has(id) ? receivePerTenpai : -payPerNoten] as const,
      );
      return {
        ...board,
        scores: addScores(board.scores, deltas),
      };
    }
  }
};

/**
 * 初期スコアボードとイベント履歴から現在の状態を再構築する。
 * Undo は history.slice(0, -1) を渡して replay するだけで実現できる。
 */
export const replay = (
  initial: Scoreboard,
  history: ReadonlyArray<ScoreMovement>,
): Scoreboard => history.reduce(apply, initial);
