import type { Points } from '../../domain/movement';
import { UMA_PRESETS, type FinalScoreConfig } from '../../domain/final-score';

/**
 * セットアップ画面で選択されたウマ・返し点から FinalScoreConfig を組み立てる。
 *
 * @param umaIndex UMA_PRESETS の index。UI の select で選択された値であり、
 *   有効範囲内 (0 以上 UMA_PRESETS.length 未満) であることを呼び出し側が保証する。
 * @param returnPoint 返し点。
 * @returns umaIndex に対応する placementBonus と returnPoint を持つ設定。
 */
export const buildFinalScoreConfig = (
  umaIndex: number,
  returnPoint: Points,
): FinalScoreConfig => ({
  returnPoint,
  placementBonus: UMA_PRESETS[umaIndex]!.bonus,
});
