import { calcKoRon, calcOyaRon } from '../../domain/score-calculation';
import type { RonScore } from '../../domain/score-calculation';

/**
 * ロン/ツモの子・親区分。
 */
export type WinnerMode = 'ko' | 'oya';

/**
 * 翻・符からロンの点数を算出する。
 *
 * @param mode 和了者の子/親区分。
 * @param han 翻数。未選択の場合は null。
 * @param fu 符数。未選択の場合は null。
 * @returns 算出された点数。han または fu が未選択の場合は null。
 */
export const calculateRonScore = (
  mode: WinnerMode,
  han: number | null,
  fu: number | null,
): RonScore | null => {
  if (han === null || fu === null) return null;
  return mode === 'ko' ? calcKoRon(han, fu) : calcOyaRon(han, fu);
};
