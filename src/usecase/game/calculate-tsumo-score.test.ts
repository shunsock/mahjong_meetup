import { describe, it, expect } from 'vitest';
import { calcKoTsumo, calcOyaTsumo } from '../../domain/score-calculation';
import { calculateTsumoScore } from './calculate-tsumo-score';

describe('calculateTsumoScore', () => {
  it('han が null なら null を返す', () => {
    expect(calculateTsumoScore('ko', null, 30)).toBeNull();
  });

  it('fu が null なら null を返す', () => {
    expect(calculateTsumoScore('ko', 3, null)).toBeNull();
  });

  it("mode が 'ko' なら calcKoTsumo(han, fu) と一致する", () => {
    expect(calculateTsumoScore('ko', 3, 30)).toEqual(calcKoTsumo(3, 30));
  });

  it("mode が 'oya' なら calcOyaTsumo(han, fu) と一致する", () => {
    expect(calculateTsumoScore('oya', 3, 30)).toEqual(calcOyaTsumo(3, 30));
  });
});
