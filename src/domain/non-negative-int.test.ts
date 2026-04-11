import { describe, expect, it } from 'vitest';
import { NonNegativeInt } from './non-negative-int';

describe('NonNegativeInt.of', () => {
  it('0 を生成できる', () => {
    expect(NonNegativeInt.of(0)).toBe(0);
  });

  it('正の整数を生成できる', () => {
    expect(NonNegativeInt.of(3)).toBe(3);
  });

  it('負の数は RangeError', () => {
    expect(() => NonNegativeInt.of(-1)).toThrow(RangeError);
  });

  it('小数は RangeError', () => {
    expect(() => NonNegativeInt.of(1.5)).toThrow(RangeError);
  });
});

describe('NonNegativeInt.increment', () => {
  it('1 増加する', () => {
    expect(NonNegativeInt.increment(NonNegativeInt.of(2))).toBe(3);
  });
});

describe('NonNegativeInt.decrement', () => {
  it('1 減少する', () => {
    expect(NonNegativeInt.decrement(NonNegativeInt.of(2))).toBe(1);
  });

  it('0 より下がらない', () => {
    expect(NonNegativeInt.decrement(NonNegativeInt.zero)).toBe(0);
  });
});
