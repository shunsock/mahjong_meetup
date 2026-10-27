import { describe, it, expect } from 'vitest';
import type { Player } from '../../domain/player';
import { resetMatch } from './reset-match';

describe('resetMatch', () => {
  it('fake port の reset が渡した players で 1 回呼ばれる', () => {
    const resetCalls: Array<ReadonlyArray<Player>> = [];
    const port = {
      reset: (players: ReadonlyArray<Player>) => {
        resetCalls.push(players);
      },
    };
    const players: ReadonlyArray<Player> = [
      { id: 'p1', name: '太郎' },
      { id: 'p2', name: '花子' },
      { id: 'p3', name: '次郎' },
      { id: 'p4', name: '三郎' },
    ];

    resetMatch(port, players);

    expect(resetCalls).toEqual([players]);
  });
});
