/**
 * 点数分配ロジック。
 *
 * 麻雀の点数計算では 100 点単位の切り上げが発生するため、
 * 「合計 8000 点」と指定しても 4000 + 2000 + 2000 のように
 * 合計が元の値と一致しない場合がある。これは麻雀の慣例。
 */

import type { Points } from './movement';

/** 100 点単位で切り上げる。 */
const roundUpTo100 = (value: Points): Points =>
  Math.ceil(value / 100) * 100;

/**
 * 子ツモ時の分配を計算する。
 *
 * - 親からの支払い: ceil(total / 4 / 100) * 100 * 2
 * - 子からの支払い: ceil(total / 4 / 100) * 100 (子2人それぞれ)
 *
 * 例: 合計 8000 → 親 4000 / 子 2000 × 2
 */
export type TsumoKoDistribution = Readonly<{
  fromOya: Points;
  fromKo: Points;
}>;

export const calcTsumoKoDistribution = (total: Points): TsumoKoDistribution => {
  const fromKo = roundUpTo100(total / 4);
  const fromOya = fromKo * 2;
  return { fromOya, fromKo };
};

/**
 * 親ツモ時の分配を計算する。
 *
 * - 子からの支払い: ceil(total / 3 / 100) * 100 (子3人それぞれ)
 *
 * 例: 合計 12000 → 子 4000 × 3
 */
export type TsumoOyaDistribution = Readonly<{
  fromKo: Points;
}>;

export const calcTsumoOyaDistribution = (total: Points): TsumoOyaDistribution => {
  const fromKo = roundUpTo100(total / 3);
  return { fromKo };
};

/**
 * 流局時のテンパイ料の分配を計算する。
 *
 * - 合計 3000 点を不テンパイ者が等分して払い、テンパイ者が等分して受け取る
 * - 全員テンパイ・全員ノーテンの場合は点数移動なし
 *
 * | テンパイ人数 | 各テンパイ者受取 | 各不テンパイ者支払 |
 * |-------------|------------------|-------------------|
 * | 0           | -                | -                 |
 * | 1           | 3000             | 1000              |
 * | 2           | 1500             | 1500              |
 * | 3           | 1000             | 3000              |
 * | 4           | -                | -                 |
 */
export type RyukyokuDistribution = Readonly<{
  receivePerTenpai: Points;
  payPerNoten: Points;
}>;

export const calcRyukyokuDistribution = (
  tenpaiCount: number,
): RyukyokuDistribution => {
  if (tenpaiCount <= 0 || tenpaiCount >= 4) {
    return { receivePerTenpai: 0, payPerNoten: 0 };
  }
  const notenCount = 4 - tenpaiCount;
  const totalPool = 3000;
  return {
    receivePerTenpai: totalPool / tenpaiCount,
    payPerNoten: totalPool / notenCount,
  };
};
