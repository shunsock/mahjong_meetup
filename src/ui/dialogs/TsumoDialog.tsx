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
import { CounterInput } from '../controls/CounterInput';
import { NaturalNumber } from '../../domain/natural-number';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onConfirm: (movement: ScoreMovement) => void;
  onCancel: () => void;
}>;

type Mode = 'ko' | 'oya';

/**
 * ツモ入力ダイアログ。
 * 子ツモの場合は「和了者」と「親」を別々に選ぶ必要がある。
 * 親ツモの場合は和了者 = 親なので親選択 UI は出さない。
 */
export const TsumoDialog = ({ players, onConfirm, onCancel }: Props) => {
  const [mode, setMode] = useState<Mode>('ko');
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [dealer, setDealer] = useState<PlayerId | null>(null);
  const [total, setTotal] = useState<Points | null>(null);
  const [honba, setHonba] = useState(NaturalNumber.of(0));

  const canConfirm =
    winner !== null &&
    total !== null &&
    total > 0 &&
    (mode === 'oya' || dealer !== null);

  const handleConfirm = () => {
    if (!canConfirm) return;
    if (mode === 'oya') {
      onConfirm({ kind: 'tsumo-oya', winner, total, honba });
    } else {
      if (dealer === null) return;
      onConfirm({ kind: 'tsumo-ko', winner, dealer, total, honba });
    }
  };

  const presets = mode === 'ko' ? KO_POINT_PRESETS : OYA_POINT_PRESETS;

  return (
    <Modal
      title="ツモ"
      onCancel={onCancel}
      onConfirm={handleConfirm}
      confirmDisabled={!canConfirm}
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="text-2xl text-neutral-400">子ツモ / 親ツモ</div>
          <div className="grid grid-cols-2 gap-3">
            <ModeButton
              label="子ツモ"
              active={mode === 'ko'}
              onClick={() => {
                setMode('ko');
                setTotal(null);
              }}
            />
            <ModeButton
              label="親ツモ"
              active={mode === 'oya'}
              onClick={() => {
                setMode('oya');
                setDealer(null);
                setTotal(null);
              }}
            />
          </div>
        </div>

        <PlayerSelector
          label="和了者"
          players={players}
          selected={winner}
          onSelect={setWinner}
        />

        {mode === 'ko' && (
          <PlayerSelector
            label="親プレイヤー"
            players={players}
            selected={dealer}
            onSelect={setDealer}
            disabledIds={winner !== null ? [winner] : []}
          />
        )}

        <ScoreInput
          label="合計点 (自動分配されます)"
          presets={presets}
          value={total}
          onSelect={setTotal}
        />

        <CounterInput
          label="本場"
          value={honba}
          onIncrement={() => setHonba(NaturalNumber.of(honba + 1))}
          onDecrement={() => setHonba(NaturalNumber.of(Math.max(0, honba - 1)))}
          onReset={() => setHonba(NaturalNumber.of(0))}
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
