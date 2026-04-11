/**
 * 最終得点 (ポイント) の計算。
 *
 * 素点 = (持ち点 - 返し点) / 1000
 * 得点 = 素点 + 順位点 (ウマ)
 *
 * デフォルト設定: 10-30 のウマ、30000 点返し
 */

import type { Points } from './movement';

/** 順位ウマ・返し点を定義する設定。 */
export type FinalScoreConfig = Readonly<{
  /** 返し点 (例: 30000) */
  returnPoint: Points;
  /** 各順位のウマ。index 0 が 1 位。 */
  placementBonus: readonly [number, number, number, number];
}>;

export const DEFAULT_CONFIG: FinalScoreConfig = {
  returnPoint: 30000,
  placementBonus: [30, 10, -10, -30],
};

/** 最終得点 (小数点 1 桁)。 */
export const calcFinalScore = (
  score: Points,
  rank: number,
  config: FinalScoreConfig,
): number => {
  const rawPoint = (score - config.returnPoint) / 1000;
  const placement = config.placementBonus[rank - 1];
  return rawPoint + placement;
};
