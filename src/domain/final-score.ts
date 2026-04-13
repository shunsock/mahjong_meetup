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

/** よく使われるウマのプリセット。ラベルは「小-大」形式。 */
export const UMA_PRESETS: ReadonlyArray<
  Readonly<{ label: string; bonus: readonly [number, number, number, number] }>
> = [
  { label: '5-10', bonus: [10, 5, -5, -10] },
  { label: '10-20', bonus: [20, 10, -10, -20] },
  { label: '10-30', bonus: [30, 10, -10, -30] },
  { label: '20-30', bonus: [30, 20, -20, -30] },
];

/** 最終得点 (小数点 1 桁)。 */
export const calcFinalScore = (
  score: Points,
  rank: number,
  config: FinalScoreConfig,
): number => {
  const rawPoint = (score - config.returnPoint) / 1000;
  const placement = config.placementBonus[rank - 1] ?? 0;
  return rawPoint + placement;
};
