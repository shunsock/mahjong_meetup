import { ChevronDown } from 'lucide-react';
import { PointStickDivider } from '../component/PointStickDivider';
import type { PlayerId } from '../../domain/player';
import type { UMA_PRESETS } from '../../domain/final-score';

type UmaPreset = (typeof UMA_PRESETS)[number];

type Props = Readonly<{
  names: Readonly<Record<PlayerId, string>>;
  playerIds: ReadonlyArray<PlayerId>;
  umaIndex: number;
  returnPoint: number;
  configOpen: boolean;
  allFilled: boolean;
  umaPresets: ReadonlyArray<UmaPreset>;
  returnPointOptions: ReadonlyArray<number>;
  onNameChange: (id: PlayerId, value: string) => void;
  onToggleConfig: () => void;
  onSelectUma: (index: number) => void;
  onSelectReturnPoint: (point: number) => void;
  onStart: () => void;
}>;

/**
 * セットアップ画面の見た目のみを担う純粋な表示コンポーネント。
 * 状態を持たず、すべての値とハンドラを props で受け取る。
 */
export const SetupLayout = ({
  names,
  playerIds,
  umaIndex,
  returnPoint,
  configOpen,
  allFilled,
  umaPresets,
  returnPointOptions,
  onNameChange,
  onToggleConfig,
  onSelectUma,
  onSelectReturnPoint,
  onStart,
}: Props) => (
  <div className="flex h-full items-center justify-center bg-neutral-950 p-8">
    <div className="w-full max-w-3xl space-y-8">
      <h1 className="text-center font-serif text-6xl font-bold text-neutral-100">
        麻雀集会
      </h1>
      <p className="text-center text-2xl text-neutral-400">
        プレイヤー名を入力してください
      </p>

      <PointStickDivider />

      <div className="grid grid-cols-2 gap-6">
        {playerIds.map((id, index) => (
          <label key={id} className="block space-y-2">
            <span className="text-2xl text-neutral-400">
              Player {index + 1}
            </span>
            <input
              type="text"
              value={names[id]}
              onChange={(e) => onNameChange(id, e.target.value)}
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
          onClick={onToggleConfig}
          className="flex w-full items-center justify-between px-6 py-5 text-left"
        >
          <h2 className="text-2xl font-bold text-neutral-300">
            順位点・返し点設定
            <span className="ml-3 text-lg font-normal text-neutral-500">
              {umaPresets[umaIndex]!.label} / {returnPoint.toLocaleString('en-US')}点返し
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
                {umaPresets.map((preset, index) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onSelectUma(index)}
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
                {returnPointOptions.map((point) => (
                  <button
                    key={point}
                    type="button"
                    onClick={() => onSelectReturnPoint(point)}
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
        onClick={onStart}
        className="w-full rounded-lg bg-emerald-700 py-6 text-4xl font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
      >
        対局開始
      </button>
    </div>
  </div>
);
