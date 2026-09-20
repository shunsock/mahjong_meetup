import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, UMA_PRESETS } from '../../domain/final-score';
import {
  loadDefaultReturnPoint,
  loadDefaultUmaIndex,
  loadReturnPointOptions,
  loadUmaPresets,
} from './load-final-score-options';

describe('loadUmaPresets', () => {
  it('UMA_PRESETS と同じ 4 プリセットを返す', () => {
    expect(loadUmaPresets()).toEqual(UMA_PRESETS);
  });
});

describe('loadReturnPointOptions', () => {
  it('[25000, 30000] を返す', () => {
    expect(loadReturnPointOptions()).toEqual([25000, 30000]);
  });
});

describe('loadDefaultUmaIndex', () => {
  it('指すプリセットの label が 10-30 である', () => {
    const presets = loadUmaPresets();
    expect(presets[loadDefaultUmaIndex()]!.label).toBe('10-30');
  });
});

describe('loadDefaultReturnPoint', () => {
  it('DEFAULT_CONFIG.returnPoint と一致する', () => {
    expect(loadDefaultReturnPoint()).toBe(DEFAULT_CONFIG.returnPoint);
  });
});
