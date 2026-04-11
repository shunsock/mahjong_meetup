import { describe, it, expect } from 'vitest';
import { calcFinalScore, DEFAULT_CONFIG } from './final-score';

describe('calcFinalScore', () => {
  it('25000 点の 1 位 → 素点 -5 + ウマ +30 = +25.0', () => {
    expect(calcFinalScore(25000, 1, DEFAULT_CONFIG)).toBe(25);
  });

  it('35000 点の 1 位 → 素点 +5 + ウマ +30 = +35.0', () => {
    expect(calcFinalScore(35000, 1, DEFAULT_CONFIG)).toBe(35);
  });

  it('30000 点の 2 位 → 素点 0 + ウマ +10 = +10.0', () => {
    expect(calcFinalScore(30000, 2, DEFAULT_CONFIG)).toBe(10);
  });

  it('20000 点の 3 位 → 素点 -10 + ウマ -10 = -20.0', () => {
    expect(calcFinalScore(20000, 3, DEFAULT_CONFIG)).toBe(-20);
  });

  it('15000 点の 4 位 → 素点 -15 + ウマ -30 = -45.0', () => {
    expect(calcFinalScore(15000, 4, DEFAULT_CONFIG)).toBe(-45);
  });

  it('端数を含む場合 (25500 点の 1 位)', () => {
    expect(calcFinalScore(25500, 1, DEFAULT_CONFIG)).toBeCloseTo(25.5);
  });

  it('カスタム設定 (20-30、25000 点返し)', () => {
    const config = {
      returnPoint: 25000,
      placementBonus: [30, 20, -20, -30] as const,
    };
    // 30000 点の 1 位 → 素点 +5 + ウマ +30 = +35
    expect(calcFinalScore(30000, 1, config)).toBe(35);
  });
});
