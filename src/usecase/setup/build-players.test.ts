import { describe, expect, it } from 'vitest';
import {
  EMPTY_PLAYER_NAMES,
  isEveryPlayerNameFilled,
  buildPlayers,
  loadPlayerIds,
} from './build-players';

describe('loadPlayerIds', () => {
  it('p1, p2, p3, p4 を順序通り返す', () => {
    expect(loadPlayerIds()).toEqual(['p1', 'p2', 'p3', 'p4']);
  });
});

describe('isEveryPlayerNameFilled', () => {
  it('EMPTY_PLAYER_NAMES は全員未入力なので false', () => {
    expect(isEveryPlayerNameFilled(EMPTY_PLAYER_NAMES)).toBe(false);
  });

  it('全員入力済みなら true', () => {
    const names = { p1: '太郎', p2: '次郎', p3: '三郎', p4: '四郎' };
    expect(isEveryPlayerNameFilled(names)).toBe(true);
  });

  it('前後にスペースしかない名前は未入力と判定される', () => {
    const names = { p1: '   ', p2: '次郎', p3: '三郎', p4: '四郎' };
    expect(isEveryPlayerNameFilled(names)).toBe(false);
  });

  it('未入力が 1 人でもあれば false', () => {
    const names = { p1: '太郎', p2: '次郎', p3: '三郎', p4: '' };
    expect(isEveryPlayerNameFilled(names)).toBe(false);
  });
});

describe('buildPlayers', () => {
  it('trim 済みの Player[] を p1→p4 順で返す', () => {
    const names = {
      p1: ' 太郎 ',
      p2: '次郎',
      p3: '三郎',
      p4: '四郎',
    };
    expect(buildPlayers(names)).toEqual([
      { id: 'p1', name: '太郎' },
      { id: 'p2', name: '次郎' },
      { id: 'p3', name: '三郎' },
      { id: 'p4', name: '四郎' },
    ]);
  });
});
