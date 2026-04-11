import { describe, expect, it } from 'vitest';
import type { Player } from './player';
import type { ScoreMovement } from './movement';
import { NaturalNumber } from './natural-number';
import {
  apply,
  createInitialScoreboard,
  INITIAL_POINTS,
  replay,
} from './scoreboard';

const players: ReadonlyArray<Player> = [
  { id: 'p1', name: 'Alice' },
  { id: 'p2', name: 'Bob' },
  { id: 'p3', name: 'Carol' },
  { id: 'p4', name: 'Dave' },
];

const initial = createInitialScoreboard(players);

describe('createInitialScoreboard', () => {
  it('全員 25000 点からスタートする', () => {
    expect(initial.scores).toEqual({
      p1: 25000,
      p2: 25000,
      p3: 25000,
      p4: 25000,
    });
  });
});

describe('apply: ron', () => {
  it('放銃者から和了者へ点数が移動する', () => {
    const result = apply(initial, {
      kind: 'ron',
      winner: 'p1',
      loser: 'p2',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });
    expect(result.scores).toEqual({
      p1: 33000,
      p2: 17000,
      p3: 25000,
      p4: 25000,
    });
  });

  it('元のボードは変更されない (immutable)', () => {
    apply(initial, {
      kind: 'ron',
      winner: 'p1',
      loser: 'p2',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });
    expect(initial.scores.p1).toBe(INITIAL_POINTS);
    expect(initial.scores.p2).toBe(INITIAL_POINTS);
  });
});

describe('apply: tsumo-ko', () => {
  it('子 p1 ツモ満貫 8000: 親 p4 から 4000、子 p2/p3 から 2000 ずつ', () => {
    const result = apply(initial, {
      kind: 'tsumo-ko',
      winner: 'p1',
      dealer: 'p4',
      total: 8000,
      honba: NaturalNumber.of(0),
    });
    expect(result.scores).toEqual({
      p1: 25000 + 4000 + 2000 + 2000,
      p2: 25000 - 2000,
      p3: 25000 - 2000,
      p4: 25000 - 4000,
    });
  });

  it('子 p2 ツモ 2000 点: 親 p1 から 1000、子 p3/p4 から 500 ずつ', () => {
    const result = apply(initial, {
      kind: 'tsumo-ko',
      winner: 'p2',
      dealer: 'p1',
      total: 2000,
      honba: NaturalNumber.of(0),
    });
    expect(result.scores).toEqual({
      p1: 25000 - 1000,
      p2: 25000 + 1000 + 500 + 500,
      p3: 25000 - 500,
      p4: 25000 - 500,
    });
  });
});

describe('apply: tsumo-oya', () => {
  it('親 p1 ツモ満貫 12000: 子全員から 4000 ずつ', () => {
    const result = apply(initial, {
      kind: 'tsumo-oya',
      winner: 'p1',
      total: 12000,
      honba: NaturalNumber.of(0),
    });
    expect(result.scores).toEqual({
      p1: 25000 + 12000,
      p2: 25000 - 4000,
      p3: 25000 - 4000,
      p4: 25000 - 4000,
    });
  });

  it('親 p3 ツモ 11600 点: 100 点単位に切り上げて 3900 × 3', () => {
    const result = apply(initial, {
      kind: 'tsumo-oya',
      winner: 'p3',
      total: 11600,
      honba: NaturalNumber.of(0),
    });
    expect(result.scores).toEqual({
      p1: 25000 - 3900,
      p2: 25000 - 3900,
      p3: 25000 + 3900 * 3,
      p4: 25000 - 3900,
    });
  });
});

describe('apply: ryukyoku', () => {
  it('テンパイ 2 人: 不テンパイ者 1500 支払、テンパイ者 1500 受取', () => {
    const result = apply(initial, {
      kind: 'ryukyoku',
      tenpai: ['p1', 'p2'],
    });
    expect(result.scores).toEqual({
      p1: 25000 + 1500,
      p2: 25000 + 1500,
      p3: 25000 - 1500,
      p4: 25000 - 1500,
    });
  });

  it('テンパイ 1 人: 不テンパイ 3 人が 1000 ずつ支払、テンパイ 1 人が 3000 受取', () => {
    const result = apply(initial, {
      kind: 'ryukyoku',
      tenpai: ['p4'],
    });
    expect(result.scores).toEqual({
      p1: 25000 - 1000,
      p2: 25000 - 1000,
      p3: 25000 - 1000,
      p4: 25000 + 3000,
    });
  });

  it('テンパイ 0 人: 点数移動なし', () => {
    const result = apply(initial, { kind: 'ryukyoku', tenpai: [] });
    expect(result.scores).toEqual(initial.scores);
  });

  it('テンパイ 4 人: 点数移動なし', () => {
    const result = apply(initial, {
      kind: 'ryukyoku',
      tenpai: ['p1', 'p2', 'p3', 'p4'],
    });
    expect(result.scores).toEqual(initial.scores);
  });
});

describe('apply: riichi', () => {
  it('リーチ宣言者から 1000 点が卓に移動する', () => {
    const result = apply(initial, { kind: 'riichi', players: ['p1'] });
    expect(result.scores.p1).toBe(25000 - 1000);
    expect(result.riichiStickCount).toBe(1);
  });

  it('複数人同時リーチで人数分の供託が積まれる', () => {
    const result = apply(initial, { kind: 'riichi', players: ['p1', 'p2'] });
    expect(result.scores.p1).toBe(25000 - 1000);
    expect(result.scores.p2).toBe(25000 - 1000);
    expect(result.riichiStickCount).toBe(2);
  });
});

describe('供託回収', () => {
  const boardWithSticks = apply(initial, {
    kind: 'riichi',
    players: ['p1', 'p2'],
  });

  it('ロン時に和了者が卓の供託を全回収する', () => {
    const result = apply(boardWithSticks, {
      kind: 'ron',
      winner: 'p3',
      loser: 'p4',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });
    // p3: +8000 (ロン) +2000 (供託2本)
    expect(result.scores.p3).toBe(25000 + 8000 + 2000);
    expect(result.scores.p4).toBe(25000 - 8000);
    expect(result.riichiStickCount).toBe(0);
  });

  it('子ツモ時に和了者が卓の供託を全回収する', () => {
    const result = apply(boardWithSticks, {
      kind: 'tsumo-ko',
      winner: 'p3',
      dealer: 'p4',
      total: 8000,
      honba: NaturalNumber.of(0),
    });
    // p3: +8000 (ツモ) +2000 (供託2本)
    expect(result.scores.p3).toBe(25000 + 8000 + 2000);
    expect(result.riichiStickCount).toBe(0);
  });

  it('親ツモ時に和了者が卓の供託を全回収する', () => {
    const result = apply(boardWithSticks, {
      kind: 'tsumo-oya',
      winner: 'p3',
      total: 12000,
      honba: NaturalNumber.of(0),
    });
    // p3: +12000 (4000×3) +2000 (供託2本)
    expect(result.scores.p3).toBe(25000 + 4000 * 3 + 2000);
    expect(result.riichiStickCount).toBe(0);
  });

  it('流局時は供託が卓に残る', () => {
    const result = apply(boardWithSticks, {
      kind: 'ryukyoku',
      tenpai: ['p3'],
    });
    expect(result.riichiStickCount).toBe(2);
  });

  it('供託 0 本の和了では供託ボーナスが 0', () => {
    const result = apply(initial, {
      kind: 'ron',
      winner: 'p1',
      loser: 'p2',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });
    expect(result.scores.p1).toBe(25000 + 8000);
    expect(result.riichiStickCount).toBe(0);
  });
});

describe('本場加算', () => {
  it('ロン 1 本場: 放銃者が 300 追加で支払う', () => {
    const result = apply(initial, {
      kind: 'ron',
      winner: 'p1',
      loser: 'p2',
      amount: 8000,
      honba: NaturalNumber.of(1),
    });
    expect(result.scores.p1).toBe(25000 + 8000 + 300);
    expect(result.scores.p2).toBe(25000 - 8000 - 300);
  });

  it('ロン 3 本場: 放銃者が 900 追加で支払う', () => {
    const result = apply(initial, {
      kind: 'ron',
      winner: 'p1',
      loser: 'p2',
      amount: 8000,
      honba: NaturalNumber.of(3),
    });
    expect(result.scores.p1).toBe(25000 + 8000 + 900);
    expect(result.scores.p2).toBe(25000 - 8000 - 900);
  });

  it('子ツモ 2 本場: 各支払者が 200 追加で支払う', () => {
    const result = apply(initial, {
      kind: 'tsumo-ko',
      winner: 'p1',
      dealer: 'p4',
      total: 8000,
      honba: NaturalNumber.of(2),
    });
    // 本場ボーナス: 各支払者 200、和了者 +600 (200×3人)
    expect(result.scores).toEqual({
      p1: 25000 + 4000 + 2000 + 2000 + 600,
      p2: 25000 - 2000 - 200,
      p3: 25000 - 2000 - 200,
      p4: 25000 - 4000 - 200,
    });
  });

  it('親ツモ 1 本場: 各子が 100 追加で支払う', () => {
    const result = apply(initial, {
      kind: 'tsumo-oya',
      winner: 'p1',
      total: 12000,
      honba: NaturalNumber.of(1),
    });
    // 本場ボーナス: 各子 100、和了者 +300 (100×3人)
    expect(result.scores).toEqual({
      p1: 25000 + 12000 + 300,
      p2: 25000 - 4000 - 100,
      p3: 25000 - 4000 - 100,
      p4: 25000 - 4000 - 100,
    });
  });
});

describe('replay', () => {
  it('空履歴なら初期状態と一致する', () => {
    expect(replay(initial, [])).toEqual(initial);
  });

  it('複数イベントを順に適用した結果が得られる', () => {
    const history: ReadonlyArray<ScoreMovement> = [
      { kind: 'ron', winner: 'p1', loser: 'p2', amount: 8000, honba: NaturalNumber.of(0) },
      { kind: 'tsumo-oya', winner: 'p1', total: 12000, honba: NaturalNumber.of(0) },
      { kind: 'ryukyoku', tenpai: ['p3', 'p4'] },
    ];
    const result = replay(initial, history);
    expect(result.scores).toEqual({
      // p1: ロン +8000、親ツモ +12000、流局で不テンパイのため -1500
      p1: 25000 + 8000 + 12000 - 1500,
      // p2: ロン -8000、親ツモ子払い -4000、流局で不テンパイのため -1500
      p2: 25000 - 8000 - 4000 - 1500,
      // p3: 親ツモ子払い -4000、流局でテンパイ +1500
      p3: 25000 - 4000 + 1500,
      // p4: 親ツモ子払い -4000、流局でテンパイ +1500
      p4: 25000 - 4000 + 1500,
    });
  });

  it('Undo 相当: 末尾を切り落として replay すると直前の状態に戻る', () => {
    const history: ReadonlyArray<ScoreMovement> = [
      { kind: 'ron', winner: 'p1', loser: 'p2', amount: 8000, honba: NaturalNumber.of(0) },
      { kind: 'ron', winner: 'p3', loser: 'p4', amount: 1000, honba: NaturalNumber.of(0) },
    ];
    const afterFirst = replay(initial, history.slice(0, 1));
    const afterUndo = replay(initial, history.slice(0, -1));
    expect(afterUndo).toEqual(afterFirst);
  });
});
