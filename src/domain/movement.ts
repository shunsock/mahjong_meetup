/**
 * 点数移動を表すイベント型 (Sum type)。
 *
 * UI は「どのイベントが起きたか」を表現するだけで、
 * 実際の点数の加算・減算は apply 関数が担当する。
 * これにより UI と計算ロジックが疎結合になる。
 */

import type { PlayerId } from './player';
import type { NaturalNumber } from './natural-number';

export type Points = number;

export type ScoreMovement =
  | Readonly<{
      kind: 'ron';
      winner: PlayerId;
      loser: PlayerId;
      amount: Points;
      honba: NaturalNumber;
    }>
  | Readonly<{
      kind: 'tsumo-ko';
      winner: PlayerId;
      dealer: PlayerId;
      total: Points;
      honba: NaturalNumber;
    }>
  | Readonly<{
      kind: 'tsumo-oya';
      winner: PlayerId;
      total: Points;
      honba: NaturalNumber;
    }>
  | Readonly<{
      kind: 'ryukyoku';
      tenpai: ReadonlyArray<PlayerId>;
    }>
  | Readonly<{
      kind: 'riichi';
      players: ReadonlyArray<PlayerId>;
    }>;
