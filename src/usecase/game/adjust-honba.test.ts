import { describe, it, expect } from 'vitest';
import { NaturalNumber } from '../../domain/natural-number';
import { incrementHonba, decrementHonba, resetHonba } from './adjust-honba';

describe('incrementHonba', () => {
  it('0 なら 1 を返す', () => {
    expect(incrementHonba(NaturalNumber.of(0))).toBe(1);
  });

  it('2 なら 3 を返す', () => {
    expect(incrementHonba(NaturalNumber.of(2))).toBe(3);
  });
});

describe('decrementHonba', () => {
  it('2 なら 1 を返す', () => {
    expect(decrementHonba(NaturalNumber.of(2))).toBe(1);
  });

  it('0 なら 0 のまま (下限)', () => {
    expect(decrementHonba(NaturalNumber.of(0))).toBe(0);
  });
});

describe('resetHonba', () => {
  it('0 を返す', () => {
    expect(resetHonba()).toBe(0);
  });
});
