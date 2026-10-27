import { describe, it, expect } from 'vitest';
import { calcKoRon, calcOyaRon } from '../../domain/score-calculation';
import { calculateRonScore } from './calculate-ron-score';

describe('calculateRonScore', () => {
  it('han が null なら null を返す', () => {
    expect(calculateRonScore('ko', null, 30)).toBeNull();
  });

  it('fu が null なら null を返す', () => {
    expect(calculateRonScore('ko', 3, null)).toBeNull();
  });

  it("mode が 'ko' なら calcKoRon(han, fu) と一致する", () => {
    expect(calculateRonScore('ko', 3, 30)).toEqual(calcKoRon(3, 30));
  });

  it("mode が 'oya' なら calcOyaRon(han, fu) と一致する", () => {
    expect(calculateRonScore('oya', 3, 30)).toEqual(calcOyaRon(3, 30));
  });
});
