/**
 * 0 以上の整数を表す値オブジェクト (branded type)。
 *
 * 本場のように「0 または正の整数」でなければならない値に使用する。
 * 生成は of() を通じてのみ行い、不正な値は型レベルで排除する。
 */

declare const brand: unique symbol;

export type NonNegativeInt = number & { readonly [brand]: 'NonNegativeInt' };

export const NonNegativeInt = {
  of(value: number): NonNegativeInt {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(
        `NonNegativeInt requires a non-negative integer, got ${value}`,
      );
    }
    return value as NonNegativeInt;
  },

  zero: 0 as NonNegativeInt,

  increment(n: NonNegativeInt): NonNegativeInt {
    return (n + 1) as NonNegativeInt;
  },

  decrement(n: NonNegativeInt): NonNegativeInt {
    return Math.max(0, n - 1) as NonNegativeInt;
  },
} as const;
