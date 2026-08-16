import { describe, it, expect } from 'vitest';
import type { ScoreMovement } from '../../domain/movement';
import { dispatchMovement } from './dispatch-movement';

describe('dispatchMovement', () => {
  it('fake port の dispatch が渡した movement で 1 回呼ばれる', () => {
    const dispatched: Array<ScoreMovement> = [];
    const port = {
      dispatch: (movement: ScoreMovement) => {
        dispatched.push(movement);
      },
    };
    const movement: ScoreMovement = {
      kind: 'riichi',
      players: ['p1'],
    };

    dispatchMovement(port, movement);

    expect(dispatched).toEqual([movement]);
  });
});
