import { describe, it, expect } from 'vitest';
import { createInitialScoreboard, apply } from '../../domain/scoreboard';
import type { Scoreboard } from '../../domain/scoreboard';
import { NaturalNumber } from '../../domain/natural-number';
import { rankStandings } from './rank-standings';

const players = [
  { id: 'p1' as const, name: '太郎' },
  { id: 'p2' as const, name: '花子' },
  { id: 'p3' as const, name: '次郎' },
  { id: 'p4' as const, name: '三郎' },
];

describe('rankStandings', () => {
  it('持ち点降順に rank 1〜4 を付与する', () => {
    const board = apply(createInitialScoreboard(players), {
      kind: 'ron',
      winner: 'p2',
      loser: 'p1',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });

    const ranked = rankStandings(board);

    expect(ranked.map((entry) => entry.player.id)).toEqual([
      'p2',
      'p3',
      'p4',
      'p1',
    ]);
    expect(ranked.map((entry) => entry.rank)).toEqual([1, 2, 3, 4]);
  });

  it('同点のプレイヤーは board.players の元の並び順を保つ', () => {
    const board: Scoreboard = createInitialScoreboard(players);

    const ranked = rankStandings(board);

    expect(ranked.map((entry) => entry.player.id)).toEqual([
      'p1',
      'p2',
      'p3',
      'p4',
    ]);
  });

  it('各エントリの deltas は順位順で自分以外の全員分 (3 件) ある', () => {
    const board = apply(createInitialScoreboard(players), {
      kind: 'ron',
      winner: 'p2',
      loser: 'p1',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });

    const ranked = rankStandings(board);
    const top = ranked[0];

    expect(top?.deltas).toHaveLength(3);
    expect(top?.deltas.map((entry) => entry.name)).toEqual([
      '次郎',
      '三郎',
      '太郎',
    ]);
  });

  it('delta 値は「自分の点 - 相手の点」である', () => {
    const board = apply(createInitialScoreboard(players), {
      kind: 'ron',
      winner: 'p2',
      loser: 'p1',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });

    const ranked = rankStandings(board);
    const top = ranked[0];

    expect(top?.deltas).toEqual([
      { name: '次郎', delta: 33000 - 25000 },
      { name: '三郎', delta: 33000 - 25000 },
      { name: '太郎', delta: 33000 - 17000 },
    ]);
  });
});
