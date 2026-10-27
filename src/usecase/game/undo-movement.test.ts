import { describe, it, expect } from 'vitest';
import { undoMovement } from './undo-movement';

describe('undoMovement', () => {
  it('fake port の undo が 1 回呼ばれる', () => {
    let undoCallCount = 0;
    const port = {
      undo: () => {
        undoCallCount += 1;
      },
    };

    undoMovement(port);

    expect(undoCallCount).toBe(1);
  });
});
