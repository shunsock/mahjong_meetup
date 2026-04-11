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

/** 子の点数プリセット (ロン・ツモ共通)。 */
export const KO_POINT_PRESETS: ReadonlyArray<Points> = [
  1000, 1300, 1600, 2000, 2600, 3200, 3900, 5200, 7700,
  8000, 12000, 16000, 24000, 32000,
] as const;

/** 親の点数プリセット (ロン・ツモ共通)。 */
export const OYA_POINT_PRESETS: ReadonlyArray<Points> = [
  1500, 2000, 2400, 2900, 3900, 4800, 5800, 7700, 11600,
  12000, 18000, 24000, 36000, 48000,
] as const;

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
