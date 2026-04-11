import { useState } from 'react';
import type { Player, PlayerId } from '../../domain/player';
import { Modal } from './Modal';
import { CounterInput } from '../controls/CounterInput';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onConfirm: (tenpai: ReadonlyArray<PlayerId>) => void;
  onCancel: () => void;
}>;

/**
 * 流局入力ダイアログ。各プレイヤーごとにテンパイ/不テンパイを
 * チェックボックス感覚でトグルして、確定時に ScoreMovement に変換する。
 */
export const RyukyokuDialog = ({ players, onConfirm, onCancel }: Props) => {
  const [tenpaiSet, setTenpaiSet] = useState<ReadonlySet<PlayerId>>(new Set());
  const [honba, setHonba] = useState(0);
  const [kyotaku, setKyotaku] = useState(0);

  const toggle = (id: PlayerId) => {
    setTenpaiSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(players.map((p) => p.id).filter((id) => tenpaiSet.has(id)));
  };

  return (
    <Modal title="流局" onCancel={onCancel} onConfirm={handleConfirm}>
      <div className="space-y-6">
        <p className="text-2xl text-neutral-400">
          テンパイしているプレイヤーを選択してください
        </p>
        <div className="grid grid-cols-2 gap-4">
          {players.map((player) => {
            const isTenpai = tenpaiSet.has(player.id);
            return (
              <button
                key={player.id}
                type="button"
                onClick={() => toggle(player.id)}
                className={`flex items-center justify-between rounded-xl px-6 py-6 text-3xl font-bold transition ${
                  isTenpai
                    ? 'bg-sky-600 text-white ring-4 ring-sky-300'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <span className="truncate">{player.name}</span>
                <span className="ml-4 text-2xl">
                  {isTenpai ? 'テンパイ' : 'ノーテン'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          <CounterInput label="本場" value={honba} onChange={setHonba} />
          <CounterInput label="供託" value={kyotaku} onChange={setKyotaku} />
        </div>
      </div>
    </Modal>
  );
};
