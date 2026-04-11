/**
 * 翻・符から点数を算出する。
 *
 * 基本点 = 符 × 4 × 2^翻
 * 翻数に応じた上限 (満貫〜役満) を適用した後、
 * 親/子・ロン/ツモに応じた倍率をかけて 100 点単位で切り上げる。
 */

import type { Points } from './movement';

/** 100 点単位で切り上げる。 */
const roundUpTo100 = (value: number): Points =>
  Math.ceil(value / 100) * 100;

/** 翻数に応じて基本点を制限する。 */
const capBasePoints = (basePoints: number, han: number): number => {
  if (han >= 13) return 8000;
  if (han >= 11) return 6000;
  if (han >= 8) return 4000;
  if (han >= 6) return 3000;
  if (basePoints > 2000) return 2000;
  return basePoints;
};

/** 基本点を算出する。符 × 4 × 2^翻 を翻数上限で制限。 */
const calcBasePoints = (han: number, fu: number): number => {
  const raw = fu * 4 * Math.pow(2, han);
  return capBasePoints(raw, han);
};

export type RonScore = Readonly<{
  total: Points;
}>;

/** 子のロン点数を算出する。基本点 × 4。 */
export const calcKoRon = (han: number, fu: number): RonScore => ({
  total: roundUpTo100(calcBasePoints(han, fu) * 4),
});

/** 親のロン点数を算出する。基本点 × 6。 */
export const calcOyaRon = (han: number, fu: number): RonScore => ({
  total: roundUpTo100(calcBasePoints(han, fu) * 6),
});

export type TsumoKoScore = Readonly<{
  fromKo: Points;
  fromOya: Points;
  total: Points;
}>;

/** 子のツモ点数を算出する。子払い = 基本点 × 1、親払い = 基本点 × 2。 */
export const calcKoTsumo = (han: number, fu: number): TsumoKoScore => {
  const base = calcBasePoints(han, fu);
  const fromKo = roundUpTo100(base);
  const fromOya = roundUpTo100(base * 2);
  return { fromKo, fromOya, total: fromKo * 2 + fromOya };
};

export type TsumoOyaScore = Readonly<{
  fromKo: Points;
  total: Points;
}>;

/** 親のツモ点数を算出する。子払い = 基本点 × 2。 */
export const calcOyaTsumo = (han: number, fu: number): TsumoOyaScore => {
  const fromKo = roundUpTo100(calcBasePoints(han, fu) * 2);
  return { fromKo, total: fromKo * 3 };
};
