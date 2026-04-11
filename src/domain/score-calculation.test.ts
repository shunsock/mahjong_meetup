import { describe, expect, it } from 'vitest';
import {
  calcKoRon,
  calcOyaRon,
  calcKoTsumo,
  calcOyaTsumo,
} from './score-calculation';

describe('calcKoRon', () => {
  it('1翻30符 → 1000', () => {
    expect(calcKoRon(1, 30).total).toBe(1000);
  });

  it('2翻30符 → 2000', () => {
    expect(calcKoRon(2, 30).total).toBe(2000);
  });

  it('3翻30符 → 3900 (切り上げ)', () => {
    expect(calcKoRon(3, 30).total).toBe(3900);
  });

  it('4翻30符 → 7700 (切り上げ)', () => {
    expect(calcKoRon(4, 30).total).toBe(7700);
  });

  it('3翻70符 → 8000 (満貫)', () => {
    // 基本点 = 70 × 4 × 8 = 2240 > 2000 → 満貫
    expect(calcKoRon(3, 70).total).toBe(8000);
  });

  it('5翻30符 → 8000 (満貫)', () => {
    expect(calcKoRon(5, 30).total).toBe(8000);
  });

  it('6翻30符 → 12000 (跳満)', () => {
    expect(calcKoRon(6, 30).total).toBe(12000);
  });

  it('8翻30符 → 16000 (倍満)', () => {
    expect(calcKoRon(8, 30).total).toBe(16000);
  });

  it('11翻30符 → 24000 (三倍満)', () => {
    expect(calcKoRon(11, 30).total).toBe(24000);
  });

  it('13翻30符 → 32000 (役満)', () => {
    expect(calcKoRon(13, 30).total).toBe(32000);
  });
});

describe('calcOyaRon', () => {
  it('1翻30符 → 1500', () => {
    expect(calcOyaRon(1, 30).total).toBe(1500);
  });

  it('3翻30符 → 5800 (切り上げ)', () => {
    expect(calcOyaRon(3, 30).total).toBe(5800);
  });

  it('5翻30符 → 12000 (満貫)', () => {
    expect(calcOyaRon(5, 30).total).toBe(12000);
  });

  it('13翻30符 → 48000 (役満)', () => {
    expect(calcOyaRon(13, 30).total).toBe(48000);
  });
});

describe('calcKoTsumo', () => {
  it('1翻30符 → 子300/親500/合計1100', () => {
    const result = calcKoTsumo(1, 30);
    expect(result.fromKo).toBe(300);
    expect(result.fromOya).toBe(500);
    expect(result.total).toBe(1100);
  });

  it('5翻30符 → 子2000/親4000/合計8000 (満貫)', () => {
    const result = calcKoTsumo(5, 30);
    expect(result.fromKo).toBe(2000);
    expect(result.fromOya).toBe(4000);
    expect(result.total).toBe(8000);
  });

  it('13翻30符 → 子8000/親16000/合計32000 (役満)', () => {
    const result = calcKoTsumo(13, 30);
    expect(result.fromKo).toBe(8000);
    expect(result.fromOya).toBe(16000);
    expect(result.total).toBe(32000);
  });
});

describe('calcOyaTsumo', () => {
  it('1翻30符 → 子500/合計1500', () => {
    const result = calcOyaTsumo(1, 30);
    expect(result.fromKo).toBe(500);
    expect(result.total).toBe(1500);
  });

  it('5翻30符 → 子4000/合計12000 (満貫)', () => {
    const result = calcOyaTsumo(5, 30);
    expect(result.fromKo).toBe(4000);
    expect(result.total).toBe(12000);
  });

  it('13翻30符 → 子16000/合計48000 (役満)', () => {
    const result = calcOyaTsumo(13, 30);
    expect(result.fromKo).toBe(16000);
    expect(result.total).toBe(48000);
  });
});
