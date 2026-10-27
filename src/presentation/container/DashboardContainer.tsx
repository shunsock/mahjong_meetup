import { useState } from 'react';
import type { Player } from '../../domain/player';
import type { Scoreboard } from '../../domain/scoreboard';
import type { ScoreMovement } from '../../domain/movement';
import { useGameStateAdapter } from '../../adapter/state/game-state-adapter';
import { dispatchMovement } from '../../usecase/game/dispatch-movement';
import { undoMovement } from '../../usecase/game/undo-movement';
import { resetMatch } from '../../usecase/game/reset-match';
import { rankStandings } from '../../usecase/game/rank-standings';
import { calculateRonScore } from '../../usecase/game/calculate-ron-score';
import { calculateTsumoScore } from '../../usecase/game/calculate-tsumo-score';
import {
  incrementHonba,
  decrementHonba,
  resetHonba,
} from '../../usecase/game/adjust-honba';
import { DashboardLayout } from '../layout/DashboardLayout';
import type { DialogKind } from '../layout/DashboardLayout';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onReset: () => void;
  onEndMatch: (board: Scoreboard) => void;
}>;

/**
 * 対局画面の状態管理を担う。GameStatePort を DI し、
 * すべての操作を usecase 層のアクション経由で port に反映する。
 */
export const DashboardContainer = ({ players, onReset, onEndMatch }: Props) => {
  const port = useGameStateAdapter(players);
  const [dialog, setDialog] = useState<DialogKind>(null);

  const ranked = rankStandings(port.board);

  const handleDispatch = (movement: ScoreMovement) => {
    dispatchMovement(port, movement);
    setDialog(null);
  };

  const handleConfirmReset = () => {
    resetMatch(port, players);
    setDialog(null);
    onReset();
  };

  const handleEndMatch = () => {
    setDialog(null);
    onEndMatch(port.board);
  };

  return (
    <DashboardLayout
      players={players}
      ranked={ranked}
      canUndo={port.canUndo}
      dialog={dialog}
      onOpenDialog={setDialog}
      onDispatch={handleDispatch}
      onUndo={() => undoMovement(port)}
      onConfirmReset={handleConfirmReset}
      onEndMatch={handleEndMatch}
      onCalculateRonScore={(mode, han, fu) =>
        calculateRonScore(mode, han, fu)?.total ?? null
      }
      onCalculateTsumoScore={(mode, han, fu) =>
        calculateTsumoScore(mode, han, fu)?.total ?? null
      }
      onIncrementHonba={incrementHonba}
      onDecrementHonba={decrementHonba}
      onResetHonba={resetHonba}
    />
  );
};
