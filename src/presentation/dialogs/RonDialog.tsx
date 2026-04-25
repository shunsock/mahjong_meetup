import { useState, useMemo } from 'react';
import type { Player, PlayerId } from '../../domain/player';
import type { ScoreMovement } from '../../domain/movement';
import { calcKoRon, calcOyaRon } from '../../domain/score-calculation';
import { Modal } from './Modal';
import { PlayerSelector } from '../controls/PlayerSelector';
import { HanFuInput } from '../controls/HanFuInput';
import { CounterInput } from '../controls/CounterInput';
import { NaturalNumber } from '../../domain/natural-number';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onConfirm: (movement: ScoreMovement) => void;
  onCancel: () => void;
}>;

type Mode = 'ko' | 'oya';

/**
 * ロン入力ダイアログ。
 * 和了者・放銃者・翻/符 (子/親切替) を入力し、点数を自動算出する。
 */
export const RonDialog = ({ players, onConfirm, onCancel }: Props) => {
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [loser, setLoser] = useState<PlayerId | null>(null);
  const [mode, setMode] = useState<Mode>('ko');
  const [han, setHan] = useState<number | null>(null);
  const [fu, setFu] = useState<number | null>(null);
  const [honba, setHonba] = useState(NaturalNumber.of(0));

  const score = useMemo(() => {
    if (han === null || fu === null) return null;
    return mode === 'ko' ? calcKoRon(han, fu) : calcOyaRon(han, fu);
  }, [han, fu, mode]);

  const canConfirm =
    winner !== null && loser !== null && score !== null;

  const handleConfirm = () => {
    if (!canConfirm || score === null) return;
    onConfirm({ kind: 'ron', winner, loser, amount: score.total, honba });
  };

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

        <HanFuInput
          han={han}
          fu={fu}
          onHanSelect={setHan}
          onFuSelect={setFu}
          calculatedScore={score?.total ?? null}
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
        ? 'bg-emerald-700 text-white ring-4 ring-emerald-400'
        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
    }`}
  >
    {label}
  </button>
);
