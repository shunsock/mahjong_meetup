import { calcKoTsumo, calcOyaTsumo } from '../../domain/score-calculation';
import type { TsumoKoScore, TsumoOyaScore } from '../../domain/score-calculation';
import type { WinnerMode } from './calculate-ron-score';

/**
 * 翻・符からツモの点数を算出する。
 *
 * @param mode 和了者の子/親区分。
 * @param han 翻数。未選択の場合は null。
 * @param fu 符数。未選択の場合は null。
 * @returns 算出された点数。han または fu が未選択の場合は null。
 */
export const calculateTsumoScore = (
  mode: WinnerMode,
  han: number | null,
  fu: number | null,
): TsumoKoScore | TsumoOyaScore | null => {
  if (han === null || fu === null) return null;
  return mode === 'ko' ? calcKoTsumo(han, fu) : calcOyaTsumo(han, fu);
};
