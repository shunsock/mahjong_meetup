import { describe, it, expect } from 'vitest';
import { createInitialScoreboard, apply } from '../../domain/scoreboard';
import type { Scoreboard } from '../../domain/scoreboard';
import { NaturalNumber } from '../../domain/natural-number';
import { DEFAULT_CONFIG, calcFinalScore } from '../../domain/final-score';
import { rankFinalScores } from './rank-final-scores';

const players = [
  { id: 'p1' as const, name: '太郎' },
  { id: 'p2' as const, name: '花子' },
  { id: 'p3' as const, name: '次郎' },
  { id: 'p4' as const, name: '三郎' },
];

describe('rankFinalScores', () => {
  it('持ち点降順に rank 1〜4 を付与する', () => {
    const board = apply(createInitialScoreboard(players), {
      kind: 'ron',
      winner: 'p2',
      loser: 'p1',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });

    const ranked = rankFinalScores(board, DEFAULT_CONFIG);

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

    const ranked = rankFinalScores(board, DEFAULT_CONFIG);

    expect(ranked.map((entry) => entry.player.id)).toEqual([
      'p1',
      'p2',
      'p3',
      'p4',
    ]);
  });

  it('finalScore が calcFinalScore(score, rank, config) と一致する (DEFAULT_CONFIG で全 4 順位)', () => {
    const board = apply(createInitialScoreboard(players), {
      kind: 'ron',
      winner: 'p2',
      loser: 'p1',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });

    const ranked = rankFinalScores(board, DEFAULT_CONFIG);

    for (const entry of ranked) {
      expect(entry.finalScore).toBe(
        calcFinalScore(entry.score, entry.rank, DEFAULT_CONFIG),
      );
    }
    expect(ranked.map((entry) => entry.rank)).toEqual([1, 2, 3, 4]);
  });

  it('入力 board を破壊しない (players 順序が呼び出し後も不変)', () => {
    const board = apply(createInitialScoreboard(players), {
      kind: 'ron',
      winner: 'p2',
      loser: 'p1',
      amount: 8000,
      honba: NaturalNumber.of(0),
    });
    const playersBefore = [...board.players];

    rankFinalScores(board, DEFAULT_CONFIG);

    expect(board.players).toEqual(playersBefore);
  });
});
