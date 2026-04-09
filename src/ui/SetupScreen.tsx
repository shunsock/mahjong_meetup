import { useState } from 'react';
import { PLAYER_IDS, type Player, type PlayerId } from '../domain/player';

type Props = Readonly<{
  onStart: (players: ReadonlyArray<Player>) => void;
}>;

type NameMap = Readonly<Record<PlayerId, string>>;

const emptyNames: NameMap = { p1: '', p2: '', p3: '', p4: '' };

/**
 * プレイヤー名の入力画面。4 人全員の名前が入力されるまで
 * 「開始」ボタンは無効化される。
 */
export const SetupScreen = ({ onStart }: Props) => {
  const [names, setNames] = useState<NameMap>(emptyNames);

  const allFilled = PLAYER_IDS.every((id) => names[id].trim().length > 0);

  const handleStart = () => {
    if (!allFilled) return;
    const players: ReadonlyArray<Player> = PLAYER_IDS.map((id) => ({
      id,
      name: names[id].trim(),
    }));
    onStart(players);
  };

  return (
    <div className="flex h-full items-center justify-center bg-neutral-950 p-8">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-center text-6xl font-bold text-neutral-100">
          麻雀ダッシュボード
        </h1>
        <p className="text-center text-2xl text-neutral-400">
          プレイヤー名を入力してください
        </p>

        <div className="grid grid-cols-2 gap-6">
          {PLAYER_IDS.map((id, index) => (
            <label key={id} className="block space-y-2">
              <span className="text-2xl text-neutral-400">
                Player {index + 1}
              </span>
              <input
                type="text"
                value={names[id]}
                onChange={(e) =>
                  setNames((prev) => ({ ...prev, [id]: e.target.value }))
                }
                className="w-full rounded-lg bg-neutral-800 px-6 py-4 text-3xl text-neutral-100 outline-none focus:ring-4 focus:ring-sky-500"
                placeholder={`プレイヤー${index + 1}`}
                autoFocus={index === 0}
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          disabled={!allFilled}
          onClick={handleStart}
          className="w-full rounded-lg bg-sky-600 py-6 text-4xl font-bold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
        >
          対局開始
        </button>
      </div>
    </div>
  );
};
