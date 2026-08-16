import type { ComponentProps } from 'react';
import { RotateCcw, LogOut } from 'lucide-react';
import type { Player, PlayerId } from '../../domain/player';
import type { ScoreMovement } from '../../domain/movement';
import type { NaturalNumber } from '../../domain/natural-number';
import { PlayerCard } from '../component/PlayerCard';
import { ActionBar } from '../component/ActionBar';
import { TopBarButton } from '../component/TopBarButton';
import { RonDialog } from '../component/dialogs/RonDialog';
import { TsumoDialog } from '../component/dialogs/TsumoDialog';
import { RyukyokuDialog } from '../component/dialogs/RyukyokuDialog';
import { RiichiDialog } from '../component/dialogs/RiichiDialog';
import { ResetDialog } from '../component/dialogs/ResetDialog';
import { EndMatchDialog } from '../component/dialogs/EndMatchDialog';

export type DialogKind = 'ron' | 'tsumo' | 'ryukyoku' | 'riichi' | 'reset' | 'endMatch' | null;

type WinnerMode = 'ko' | 'oya';

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
  onCalculateRonScore: (mode: WinnerMode, han: number | null, fu: number | null) => number | null;
  onCalculateTsumoScore: (mode: WinnerMode, han: number | null, fu: number | null) => number | null;
  onIncrementHonba: (current: NaturalNumber) => NaturalNumber;
  onDecrementHonba: (current: NaturalNumber) => NaturalNumber;
  onResetHonba: () => NaturalNumber;
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
  onCalculateRonScore,
  onCalculateTsumoScore,
  onIncrementHonba,
  onDecrementHonba,
  onResetHonba,
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
        onCalculateScore={onCalculateRonScore}
        onIncrementHonba={onIncrementHonba}
        onDecrementHonba={onDecrementHonba}
        onResetHonba={onResetHonba}
      />
    )}
    {dialog === 'tsumo' && (
      <TsumoDialog
        players={players}
        onConfirm={onDispatch}
        onCancel={() => onOpenDialog(null)}
        onCalculateScore={onCalculateTsumoScore}
        onIncrementHonba={onIncrementHonba}
        onDecrementHonba={onDecrementHonba}
        onResetHonba={onResetHonba}
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
