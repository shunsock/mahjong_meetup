import {
  DEFAULT_CONFIG,
  UMA_PRESETS,
  type FinalScoreConfig,
} from '../../domain/final-score';
import type { Points } from '../../domain/movement';

/**
 * UMA_PRESETS の index と返し点から FinalScoreConfig を組み立てる。
 * 範囲外の umaIndex は DEFAULT_CONFIG.placementBonus にフォールバックする。
 */
export const buildFinalScoreConfig = (
  umaIndex: number,
  returnPoint: Points,
): FinalScoreConfig => ({
  returnPoint,
  placementBonus:
    UMA_PRESETS[umaIndex]?.bonus ?? DEFAULT_CONFIG.placementBonus,
});
