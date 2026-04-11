import { useState } from 'react';
import type { Player, PlayerId } from '../../domain/player';
import { Modal } from './Modal';

type Props = Readonly<{
  players: ReadonlyArray<Player>;
  onConfirm: (riichiPlayers: ReadonlyArray<PlayerId>) => void;
  onCancel: () => void;
}>;

/**
 * リーチ宣言入力ダイアログ。
 * 流局ダイアログと同様にプレイヤーをトグル選択し、
 * 確定時にまとめて riichi イベントを発行する。
 */
export const RiichiDialog = ({ players, onConfirm, onCancel }: Props) => {
  const [selected, setSelected] = useState<ReadonlySet<PlayerId>>(new Set());

  const toggle = (id: PlayerId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const canConfirm = selected.size > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(players.map((p) => p.id).filter((id) => selected.has(id)));
  };

  return (
    <Modal
      title="リーチ"
      onCancel={onCancel}
      onConfirm={handleConfirm}
      confirmDisabled={!canConfirm}
    >
      <div className="space-y-6">
        <p className="text-2xl text-neutral-400">
          リーチ宣言するプレイヤーを選択してください
        </p>
        <div className="grid grid-cols-2 gap-4">
          {players.map((player) => {
            const isSelected = selected.has(player.id);
            return (
              <button
                key={player.id}
                type="button"
                onClick={() => toggle(player.id)}
                className={`flex items-center justify-between rounded-xl px-6 py-6 text-3xl font-bold transition ${
                  isSelected
                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-400'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <span className="truncate">{player.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
