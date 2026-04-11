import { describe, expect, it } from 'vitest';
import { NaturalNumber } from './natural-number';

describe('NaturalNumber.of', () => {
  it('0 を生成できる', () => {
    expect(NaturalNumber.of(0)).toBe(0);
  });

  it('正の整数を生成できる', () => {
    expect(NaturalNumber.of(3)).toBe(3);
  });

  it('負の数は RangeError', () => {
    expect(() => NaturalNumber.of(-1)).toThrow(RangeError);
  });

  it('小数は RangeError', () => {
    expect(() => NaturalNumber.of(1.5)).toThrow(RangeError);
  });
});
