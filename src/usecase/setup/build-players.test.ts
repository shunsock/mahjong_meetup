import { describe, it, expect } from 'vitest';
import { PLAYER_IDS } from '../../domain/player';
import { buildPlayers } from './build-players';

describe('buildPlayers', () => {
  it('前後のスペースを除去した名前で Player を組み立てる', () => {
    const players = buildPlayers({
      p1: '  太郎  ',
      p2: '花子',
      p3: '次郎',
      p4: '三郎',
    });

    expect(players[0]?.name).toBe('太郎');
  });

  it('名前の内部にあるスペースは保持する', () => {
    const players = buildPlayers({
      p1: '山田 太郎',
      p2: '花子',
      p3: '次郎',
      p4: '三郎',
    });

    expect(players[0]?.name).toBe('山田 太郎');
  });

  it('戻り値の順序と id が PLAYER_IDS (p1→p4) に一致する', () => {
    const players = buildPlayers({
      p1: '太郎',
      p2: '花子',
      p3: '次郎',
      p4: '三郎',
    });

    expect(players.map((player) => player.id)).toEqual(PLAYER_IDS);
  });
});
