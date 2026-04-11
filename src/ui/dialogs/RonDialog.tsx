import { useState } from 'react';
import type { Player, PlayerId } from '../../domain/player';
import {
  KO_POINT_PRESETS,
  OYA_POINT_PRESETS,
  type Points,
  type ScoreMovement,
} from '../../domain/movement';
import { Modal } from './Modal';
import { PlayerSelector } from '../controls/PlayerSelector';
import { ScoreInput } from '../controls/ScoreInput';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onConfirm: (movement: ScoreMovement) => void;
  onCancel: () => void;
}>;

type Mode = 'ko' | 'oya';

/**
 * ロン入力ダイアログ。
 * 和了者・放銃者・点数 (和了者が子/親かでプリセット切替) を入力する。
 * このアプリは親情報を持たないので、子/親はプリセットの数値を
 * 切り替えるための UI 上の便宜的な選択肢として扱う。
 */
export const RonDialog = ({ players, onConfirm, onCancel }: Props) => {
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [loser, setLoser] = useState<PlayerId | null>(null);
  const [mode, setMode] = useState<Mode>('ko');
  const [amount, setAmount] = useState<Points | null>(null);

  const canConfirm =
    winner !== null && loser !== null && amount !== null && amount > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm({ kind: 'ron', winner, loser, amount });
  };

  const presets = mode === 'ko' ? KO_POINT_PRESETS : OYA_POINT_PRESETS;

  return (
    <Modal
      title="ロン"
      onCancel={onCancel}
      onConfirm={handleConfirm}
      confirmDisabled={!canConfirm}
    >
      <div className="space-y-8">
        <PlayerSelector
          label="和了者"
          players={players}
          selected={winner}
          onSelect={setWinner}
        />
        <PlayerSelector
          label="放銃者"
          players={players}
          selected={loser}
          onSelect={setLoser}
          disabledIds={winner !== null ? [winner] : []}
        />

        <div className="space-y-3">
          <div className="text-2xl text-neutral-400">和了者</div>
          <div className="grid grid-cols-2 gap-3">
            <ModeButton
              label="子"
              active={mode === 'ko'}
              onClick={() => setMode('ko')}
            />
            <ModeButton
              label="親"
              active={mode === 'oya'}
              onClick={() => setMode('oya')}
            />
          </div>
        </div>

        <ScoreInput
          label="点数"
          presets={presets}
          value={amount}
          onSelect={setAmount}
        />
      </div>
    </Modal>
  );
};

const ModeButton = ({
  label,
  active,
  onClick,
}: Readonly<{ label: string; active: boolean; onClick: () => void }>) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl py-4 text-3xl font-bold transition ${
      active
        ? 'bg-sky-600 text-white ring-4 ring-sky-300'
        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
    }`}
  >
    {label}
  </button>
);
