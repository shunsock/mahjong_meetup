import {
  DEFAULT_CONFIG,
  UMA_PRESETS,
  type UmaPreset,
} from '../../domain/final-score';
import type { Points } from '../../domain/movement';

const RETURN_POINT_OPTIONS: ReadonlyArray<Points> = [25000, 30000];

/** domain の UMA_PRESETS を usecase 境界として提供する。 */
export const loadUmaPresets = (): ReadonlyArray<UmaPreset> => UMA_PRESETS;

/** 返し点として選択可能な選択肢の一覧。 */
export const loadReturnPointOptions = (): ReadonlyArray<Points> =>
  RETURN_POINT_OPTIONS;

/** 初期選択とする UMA_PRESETS の index (label '10-30')。 */
export const loadDefaultUmaIndex = (): number =>
  UMA_PRESETS.findIndex((preset) => preset.label === '10-30');

/** 初期選択とする返し点。 */
export const loadDefaultReturnPoint = (): Points => DEFAULT_CONFIG.returnPoint;
