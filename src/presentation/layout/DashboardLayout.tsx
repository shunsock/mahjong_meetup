import type { ComponentProps } from 'react';
import { RotateCcw, LogOut } from 'lucide-react';
import type { Player, PlayerId } from '../../domain/player';
import type { ScoreMovement } from '../../domain/movement';
import { PlayerCard } from '../component/PlayerCard';
import { ActionBar } from '../component/ActionBar';
import { TopBarButton } from '../component/TopBarButton';
import { RonDialog } from '../dialogs/RonDialog';
import { TsumoDialog } from '../dialogs/TsumoDialog';
import { RyukyokuDialog } from '../dialogs/RyukyokuDialog';
import { RiichiDialog } from '../dialogs/RiichiDialog';
import { ResetDialog } from '../dialogs/ResetDialog';
import { EndMatchDialog } from '../dialogs/EndMatchDialog';

export type DialogKind = 'ron' | 'tsumo' | 'ryukyoku' | 'riichi' | 'reset' | 'endMatch' | null;

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  ranked: ReadonlyArray<ComponentProps<typeof PlayerCard>>;
  canUndo: boolean;
  dialog: DialogKind;
  onOpenDialog: (dialog: DialogKind) => void;
  onDispatch: (movement: ScoreMovement) => void;
  onUndo: () => void;
  onConfirmReset: () => void;
  onEndMatch: () => void;
}>;

/**
 * 対局画面の見た目のみを担う純粋な表示コンポーネント。
 * 状態を持たず、すべての値とハンドラを props で受け取る。
 */
export const DashboardLayout = ({
  players,
  ranked,
  canUndo,
  dialog,
  onOpenDialog,
  onDispatch,
  onUndo,
  onConfirmReset,
  onEndMatch,
}: Props) => (
  <div className="flex h-full flex-col bg-neutral-950 p-6">
    <div className="flex justify-end gap-3">
      <TopBarButton
        icon={<RotateCcw size={18} />}
        label="リセット"
        onClick={() => onOpenDialog('reset')}
        hoverClass="hover:bg-red-700 hover:text-white"
      />
      <TopBarButton
        icon={<LogOut size={18} />}
        label="対戦終了"
        onClick={() => onOpenDialog('endMatch')}
        hoverClass="hover:bg-emerald-700 hover:text-white"
      />
    </div>

    <div className="mt-4 flex flex-1 gap-4">
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
      onRon={() => onOpenDialog('ron')}
      onTsumo={() => onOpenDialog('tsumo')}
      onRyukyoku={() => onOpenDialog('ryukyoku')}
      onRiichi={() => onOpenDialog('riichi')}
      onUndo={onUndo}
    />

    {dialog === 'ron' && (
      <RonDialog
        players={players}
        onConfirm={onDispatch}
        onCancel={() => onOpenDialog(null)}
      />
    )}
    {dialog === 'tsumo' && (
      <TsumoDialog
        players={players}
        onConfirm={onDispatch}
        onCancel={() => onOpenDialog(null)}
      />
    )}
    {dialog === 'ryukyoku' && (
      <RyukyokuDialog
        players={players}
        onConfirm={(tenpai: ReadonlyArray<PlayerId>) =>
          onDispatch({ kind: 'ryukyoku', tenpai })
        }
        onCancel={() => onOpenDialog(null)}
      />
    )}
    {dialog === 'riichi' && (
      <RiichiDialog
        players={players}
        onConfirm={(riichiPlayers: ReadonlyArray<PlayerId>) =>
          onDispatch({ kind: 'riichi', players: riichiPlayers })
        }
        onCancel={() => onOpenDialog(null)}
      />
    )}
    {dialog === 'reset' && (
      <ResetDialog
        onConfirm={onConfirmReset}
        onCancel={() => onOpenDialog(null)}
      />
    )}
    {dialog === 'endMatch' && (
      <EndMatchDialog
        onConfirm={onEndMatch}
        onCancel={() => onOpenDialog(null)}
      />
    )}
  </div>
);
