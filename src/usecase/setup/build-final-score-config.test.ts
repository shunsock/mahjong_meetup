import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, UMA_PRESETS } from '../../domain/final-score';
import { buildFinalScoreConfig } from './build-final-score-config';

describe('buildFinalScoreConfig', () => {
  it('有効な umaIndex (0: 5-10) から対応プリセットの bonus を持つ config を組み立てる', () => {
    const config = buildFinalScoreConfig(0, 30000);
    expect(config.placementBonus).toEqual(UMA_PRESETS[0]!.bonus);
  });

  it('有効な umaIndex (3: 20-30) から対応プリセットの bonus を持つ config を組み立てる', () => {
    const config = buildFinalScoreConfig(3, 30000);
    expect(config.placementBonus).toEqual(UMA_PRESETS[3]!.bonus);
  });

  it('returnPoint が config にそのまま入る', () => {
    const config = buildFinalScoreConfig(0, 25000);
    expect(config.returnPoint).toBe(25000);
  });

  it('範囲外の umaIndex (-1) は DEFAULT_CONFIG.placementBonus にフォールバックする', () => {
    const config = buildFinalScoreConfig(-1, 30000);
    expect(config.placementBonus).toEqual(DEFAULT_CONFIG.placementBonus);
  });

  it('範囲外の umaIndex (4) は DEFAULT_CONFIG.placementBonus にフォールバックする', () => {
    const config = buildFinalScoreConfig(4, 30000);
    expect(config.placementBonus).toEqual(DEFAULT_CONFIG.placementBonus);
  });
});
