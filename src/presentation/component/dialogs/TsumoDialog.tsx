import { useState, useMemo } from 'react';
import type { Player, PlayerId } from '../../../domain/player';
import type { ScoreMovement } from '../../../domain/movement';
import type { NaturalNumber } from '../../../domain/natural-number';
import { Modal } from './Modal';
import { PlayerSelector } from '../controls/PlayerSelector';
import { HanFuInput } from '../controls/HanFuInput';
import { CounterInput } from '../controls/CounterInput';

type Mode = 'ko' | 'oya';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onConfirm: (movement: ScoreMovement) => void;
  onCancel: () => void;
  onCalculateScore: (mode: Mode, han: number | null, fu: number | null) => number | null;
  onIncrementHonba: (current: NaturalNumber) => NaturalNumber;
  onDecrementHonba: (current: NaturalNumber) => NaturalNumber;
  onResetHonba: () => NaturalNumber;
}>;

/**
 * ツモ入力ダイアログ。
 * 翻/符から点数を自動算出する。
 * 子ツモの場合は「和了者」と「親」を別々に選ぶ必要がある。
 * 親ツモの場合は和了者 = 親なので親選択 UI は出さない。
 * 点数算出・本場カウンタの操作は props 経由で usecase 層に委譲する。
 */
export const TsumoDialog = ({
  players,
  onConfirm,
  onCancel,
  onCalculateScore,
  onIncrementHonba,
  onDecrementHonba,
  onResetHonba,
}: Props) => {
  const [mode, setMode] = useState<Mode>('ko');
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [dealer, setDealer] = useState<PlayerId | null>(null);
  const [han, setHan] = useState<number | null>(null);
  const [fu, setFu] = useState<number | null>(null);
  const [honba, setHonba] = useState<NaturalNumber>(onResetHonba);

  const score = useMemo(
    () => onCalculateScore(mode, han, fu),
    [han, fu, mode, onCalculateScore],
  );

  const canConfirm =
    winner !== null &&
    score !== null &&
    (mode === 'oya' || dealer !== null);

  const handleConfirm = () => {
    if (!canConfirm || score === null) return;
    if (mode === 'oya') {
      onConfirm({ kind: 'tsumo-oya', winner, total: score, honba });
    } else {
      if (dealer === null) return;
      onConfirm({ kind: 'tsumo-ko', winner, dealer, total: score, honba });
    }
  };

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
                setHan(null);
                setFu(null);
              }}
            />
            <ModeButton
              label="親ツモ"
              active={mode === 'oya'}
              onClick={() => {
                setMode('oya');
                setDealer(null);
                setHan(null);
                setFu(null);
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

        <HanFuInput
          han={han}
          fu={fu}
          onHanSelect={setHan}
          onFuSelect={setFu}
          calculatedScore={score}
        />

        <CounterInput
          label="本場"
          value={honba}
          onIncrement={() => setHonba(onIncrementHonba(honba))}
          onDecrement={() => setHonba(onDecrementHonba(honba))}
          onReset={() => setHonba(onResetHonba())}
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
        ? 'bg-emerald-700 text-white ring-4 ring-emerald-400'
        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
    }`}
  >
    {label}
  </button>
);
