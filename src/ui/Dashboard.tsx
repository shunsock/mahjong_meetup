import { useState } from 'react';
import type { Player, PlayerId } from '../domain/player';
import type { Scoreboard } from '../domain/scoreboard';
import type { ScoreMovement } from '../domain/movement';
import { useGameState } from '../state/useGameState';
import { PlayerCard } from './PlayerCard';
import { RonDialog } from './dialogs/RonDialog';
import { TsumoDialog } from './dialogs/TsumoDialog';
import { RyukyokuDialog } from './dialogs/RyukyokuDialog';
import { RiichiDialog } from './dialogs/RiichiDialog';
import { ResetDialog } from './dialogs/ResetDialog';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onReset: () => void;
}>;

type DialogKind = 'ron' | 'tsumo' | 'ryukyoku' | 'riichi' | 'reset' | null;

type DeltaEntry = Readonly<{
  name: string;
  delta: number;
}>;

type RankedPlayer = Readonly<{
  player: Player;
  score: number;
  rank: number;
  deltas: ReadonlyArray<DeltaEntry>;
}>;

/**
 * 持ち点で降順ソートし、同点は元の並び順を保ったまま順位を付与する。
 * 各プレイヤーに対して他全員との点差を順位順で算出する。
 */
const rankPlayers = (board: Scoreboard): ReadonlyArray<RankedPlayer> => {
  const withScores = board.players.map((player) => ({
    player,
    score: board.scores[player.id],
  }));
  const sorted = [...withScores].sort((a, b) => b.score - a.score);
  return sorted.map((entry, index) => ({
    player: entry.player,
    score: entry.score,
    rank: index + 1,
    deltas: sorted
      .filter((other) => other.player.id !== entry.player.id)
      .map((other) => ({
        name: other.player.name,
        delta: entry.score - other.score,
      })),
  }));
};

export const Dashboard = ({ players, onReset }: Props) => {
  const { board, canUndo, dispatch, undo, reset } = useGameState(players);
  const [dialog, setDialog] = useState<DialogKind>(null);

  const ranked = rankPlayers(board);

  const handleDispatch = (movement: ScoreMovement) => {
    dispatch(movement);
    setDialog(null);
  };

  const handleConfirmReset = () => {
    reset(players);
    setDialog(null);
    onReset();
  };

  return (
    <div className="flex h-full flex-col bg-neutral-950 p-6">
      <div className="flex flex-1 gap-4">
        {ranked.map((entry) => (
          <PlayerCard
            key={entry.player.id}
            player={entry.player}
            score={entry.score}
            rank={entry.rank}
            deltas={entry.deltas}
          />
        ))}
      </div>

      <ActionBar
        canUndo={canUndo}
        onRon={() => setDialog('ron')}
        onTsumo={() => setDialog('tsumo')}
        onRyukyoku={() => setDialog('ryukyoku')}
        onRiichi={() => setDialog('riichi')}
        onUndo={undo}
        onReset={() => setDialog('reset')}
      />

      {dialog === 'ron' && (
        <RonDialog
          players={players}
          onConfirm={handleDispatch}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === 'tsumo' && (
        <TsumoDialog
          players={players}
          onConfirm={handleDispatch}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === 'ryukyoku' && (
        <RyukyokuDialog
          players={players}
          onConfirm={(tenpai: ReadonlyArray<PlayerId>) =>
            handleDispatch({ kind: 'ryukyoku', tenpai })
          }
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === 'riichi' && (
        <RiichiDialog
          players={players}
          onConfirm={(riichiPlayers: ReadonlyArray<PlayerId>) =>
            handleDispatch({ kind: 'riichi', players: riichiPlayers })
          }
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === 'reset' && (
        <ResetDialog
          onConfirm={handleConfirmReset}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
};

type ActionBarProps = Readonly<{
  canUndo: boolean;
  onRon: () => void;
  onTsumo: () => void;
  onRyukyoku: () => void;
  onRiichi: () => void;
  onUndo: () => void;
  onReset: () => void;
}>;

const ActionBar = ({
  canUndo,
  onRon,
  onTsumo,
  onRyukyoku,
  onRiichi,
  onUndo,
  onReset,
}: ActionBarProps) => (
  <div className="mt-6 flex gap-4">
    <ActionButton label="リーチ" onClick={onRiichi} variant="primary" />
    <ActionButton label="ロン" onClick={onRon} variant="primary" />
    <ActionButton label="ツモ" onClick={onTsumo} variant="primary" />
    <ActionButton label="流局" onClick={onRyukyoku} variant="primary" />
    <ActionButton
      label="Undo"
      onClick={onUndo}
      variant="secondary"
      disabled={!canUndo}
    />
    <ActionButton label="リセット" onClick={onReset} variant="danger" />
  </div>
);

type ActionButtonProps = Readonly<{
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}>;

const buttonVariantClass = (variant: ActionButtonProps['variant']): string => {
  switch (variant) {
    case 'primary':
      return 'bg-emerald-700 hover:bg-emerald-600';
    case 'secondary':
      return 'bg-neutral-700 hover:bg-neutral-600';
    case 'danger':
      return 'bg-red-700 hover:bg-red-600';
  }
};

const ActionButton = ({
  label,
  onClick,
  variant,
  disabled = false,
}: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 rounded-xl py-6 text-4xl font-bold text-white transition disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600 ${buttonVariantClass(
      variant,
    )}`}
  >
    {label}
  </button>
);
