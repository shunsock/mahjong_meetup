import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PointStickDivider } from './PointStickDivider';
import { PLAYER_IDS, type Player, type PlayerId } from '../domain/player';
import {
  DEFAULT_CONFIG,
  UMA_PRESETS,
  type FinalScoreConfig,
} from '../domain/final-score';

type Props = Readonly<{
  onStart: (
    players: ReadonlyArray<Player>,
    config: FinalScoreConfig,
  ) => void;
}>;

type NameMap = Readonly<Record<PlayerId, string>>;

const emptyNames: NameMap = { p1: '', p2: '', p3: '', p4: '' };

const RETURN_POINT_OPTIONS = [25000, 30000] as const;

/**
 * プレイヤー名・ウマオカの入力画面。
 * 4 人全員の名前が入力されるまで「開始」ボタンは無効化される。
 */
export const SetupScreen = ({ onStart }: Props) => {
  const [names, setNames] = useState<NameMap>(emptyNames);
  const [umaIndex, setUmaIndex] = useState(
    UMA_PRESETS.findIndex((p) => p.label === '10-30'),
  );
  const [returnPoint, setReturnPoint] = useState(DEFAULT_CONFIG.returnPoint);
  const [configOpen, setConfigOpen] = useState(false);

  const allFilled = PLAYER_IDS.every((id) => names[id].trim().length > 0);

  const handleStart = () => {
    if (!allFilled) return;
    const players: ReadonlyArray<Player> = PLAYER_IDS.map((id) => ({
      id,
      name: names[id].trim(),
    }));
    const config: FinalScoreConfig = {
      returnPoint,
      placementBonus: UMA_PRESETS[umaIndex].bonus,
    };
    onStart(players, config);
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

        <PointStickDivider />

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
                className="w-full rounded-lg bg-neutral-800 px-6 py-4 text-3xl text-neutral-100 outline-none focus:ring-4 focus:ring-emerald-500"
                placeholder={`プレイヤー${index + 1}`}
                autoFocus={index === 0}
              />
            </label>
          ))}
        </div>

        <div className="rounded-2xl bg-neutral-900 ring-1 ring-neutral-800">
          <button
            type="button"
            onClick={() => setConfigOpen((prev) => !prev)}
            className="flex w-full items-center justify-between px-6 py-5 text-left"
          >
            <h2 className="text-2xl font-bold text-neutral-300">
              順位点・返し点設定
              <span className="ml-3 text-lg font-normal text-neutral-500">
                {UMA_PRESETS[umaIndex].label} / {returnPoint.toLocaleString('en-US')}点返し
              </span>
            </h2>
            <ChevronDown
              size={24}
              className={`text-neutral-400 transition-transform ${configOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {configOpen && (
            <div className="space-y-4 border-t border-neutral-800 px-6 pb-6 pt-4">
              <div className="space-y-2">
                <span className="text-xl text-neutral-400">順位点</span>
                <div className="flex gap-3">
                  {UMA_PRESETS.map((preset, index) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setUmaIndex(index)}
                      className={`flex-1 rounded-lg py-3 text-2xl font-bold transition ${
                        umaIndex === index
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-400'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xl text-neutral-400">返し点</span>
                <div className="flex gap-3">
                  {RETURN_POINT_OPTIONS.map((point) => (
                    <button
                      key={point}
                      type="button"
                      onClick={() => setReturnPoint(point)}
                      className={`flex-1 rounded-lg py-3 text-2xl font-bold transition ${
                        returnPoint === point
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-400'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {point.toLocaleString('en-US')}点
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <PointStickDivider />

        <button
          type="button"
          disabled={!allFilled}
          onClick={handleStart}
          className="w-full rounded-lg bg-emerald-700 py-6 text-4xl font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
        >
          対局開始
        </button>
      </div>
    </div>
  );
};
