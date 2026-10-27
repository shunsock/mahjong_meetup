import { describe, it, expect } from 'vitest';
import { UMA_PRESETS } from '../../domain/final-score';
import { buildFinalScoreConfig } from './build-final-score-config';

describe('buildFinalScoreConfig', () => {
  it('returnPoint がそのまま反映される', () => {
    const config = buildFinalScoreConfig(0, 25000);

    expect(config.returnPoint).toBe(25000);
  });

  it.each(UMA_PRESETS.map((preset, index) => [index, preset] as const))(
    'umaIndex %i の UMA_PRESETS.bonus が placementBonus になる',
    (umaIndex, preset) => {
      const config = buildFinalScoreConfig(umaIndex, 30000);

      expect(config.placementBonus).toEqual(preset.bonus);
    },
  );
});
