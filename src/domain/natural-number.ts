/**
 * 自然数 (0 以上の整数) を表す値オブジェクト (branded type)。
 *
 * 本場のように「0 または正の整数」でなければならない値に使用する。
 * 生成は of() を通じてのみ行い、不正な値は型レベルで排除する。
 */

declare const brand: unique symbol;

export type NaturalNumber = number & { readonly [brand]: 'NaturalNumber' };

export const NaturalNumber = {
  of(value: number): NaturalNumber {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(
        `NaturalNumber requires a non-negative integer, got ${value}`,
      );
    }
    return value as NaturalNumber;
  },
} as const;
