import { describe, expect, it } from 'vitest';
import {
  calcRyukyokuDistribution,
  calcTsumoKoDistribution,
  calcTsumoOyaDistribution,
} from './distribution';

describe('calcTsumoKoDistribution', () => {
  it('満貫 8000 点は 親 4000 / 子 2000 × 2 に分配される', () => {
    expect(calcTsumoKoDistribution(8000)).toEqual({
      fromOya: 4000,
      fromKo: 2000,
    });
  });

  it('跳満 12000 点は 親 6000 / 子 3000 × 2 に分配される', () => {
    expect(calcTsumoKoDistribution(12000)).toEqual({
      fromOya: 6000,
      fromKo: 3000,
    });
  });

  it('倍満 16000 点は 親 8000 / 子 4000 × 2 に分配される', () => {
    expect(calcTsumoKoDistribution(16000)).toEqual({
      fromOya: 8000,
      fromKo: 4000,
    });
  });

  it('役満 32000 点は 親 16000 / 子 8000 × 2 に分配される', () => {
    expect(calcTsumoKoDistribution(32000)).toEqual({
      fromOya: 16000,
      fromKo: 8000,
    });
  });

  it('4 翻 30 符 7700 点は 100 点単位に切り上げて 親 4000 / 子 2000 になる', () => {
    // 7700 / 4 = 1925 → 切り上げて 2000
    expect(calcTsumoKoDistribution(7700)).toEqual({
      fromOya: 4000,
      fromKo: 2000,
    });
  });

  it('2 翻 30 符 2000 点は 親 1000 / 子 500 になる', () => {
    // 2000 / 4 = 500 → そのまま 500
    expect(calcTsumoKoDistribution(2000)).toEqual({
      fromOya: 1000,
      fromKo: 500,
    });
  });
});

describe('calcTsumoOyaDistribution', () => {
  it('満貫 12000 点は 子 4000 × 3 に分配される', () => {
    expect(calcTsumoOyaDistribution(12000)).toEqual({ fromKo: 4000 });
  });

  it('跳満 18000 点は 子 6000 × 3 に分配される', () => {
    expect(calcTsumoOyaDistribution(18000)).toEqual({ fromKo: 6000 });
  });

  it('役満 48000 点は 子 16000 × 3 に分配される', () => {
    expect(calcTsumoOyaDistribution(48000)).toEqual({ fromKo: 16000 });
  });

  it('親 4 翻 30 符 11600 点は 100 点単位に切り上げて 子 3900 × 3 になる', () => {
    // 11600 / 3 = 3866.67 → 切り上げて 3900
    expect(calcTsumoOyaDistribution(11600)).toEqual({ fromKo: 3900 });
  });
});

describe('calcRyukyokuDistribution', () => {
  it('テンパイ 0 人は点数移動なし', () => {
    expect(calcRyukyokuDistribution(0)).toEqual({
      receivePerTenpai: 0,
      payPerNoten: 0,
    });
  });

  it('テンパイ 1 人は受取 3000 / 支払 1000', () => {
    expect(calcRyukyokuDistribution(1)).toEqual({
      receivePerTenpai: 3000,
      payPerNoten: 1000,
    });
  });

  it('テンパイ 2 人は受取 1500 / 支払 1500', () => {
    expect(calcRyukyokuDistribution(2)).toEqual({
      receivePerTenpai: 1500,
      payPerNoten: 1500,
    });
  });

  it('テンパイ 3 人は受取 1000 / 支払 3000', () => {
    expect(calcRyukyokuDistribution(3)).toEqual({
      receivePerTenpai: 1000,
      payPerNoten: 3000,
    });
  });

  it('テンパイ 4 人は点数移動なし', () => {
    expect(calcRyukyokuDistribution(4)).toEqual({
      receivePerTenpai: 0,
      payPerNoten: 0,
    });
  });
});
