import { ChevronDown } from 'lucide-react';
import { PointStickDivider } from '../component/PointStickDivider';
import type { PlayerId } from '../../domain/player';
import type { Points } from '../../domain/movement';

/** 1 人分の名前入力欄が受け取る表示用の情報。 */
export type PlayerInputField = Readonly<{
  id: PlayerId;
  label: string;
  placeholder: string;
  value: string;
}>;

/** ウマプリセットの表示用情報 (label のみ layout で使用)。 */
type UmaPresetOption = Readonly<{ label: string }>;

type Props = Readonly<{
  playerInputs: ReadonlyArray<PlayerInputField>;
  onNameChange: (id: PlayerId, value: string) => void;
  umaPresets: ReadonlyArray<UmaPresetOption>;
  umaIndex: number;
  onSelectUma: (index: number) => void;
  returnPointOptions: ReadonlyArray<Points>;
  returnPoint: Points;
  onSelectReturnPoint: (point: Points) => void;
  isConfigOpen: boolean;
  onToggleConfig: () => void;
  canStart: boolean;
  onStart: () => void;
}>;

const buildSelectableButtonClass = (isSelected: boolean): string =>
  `flex-1 rounded-lg py-3 text-2xl font-bold transition ${
    isSelected
      ? 'bg-emerald-700 text-white ring-4 ring-emerald-400'
      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
  }`;

/**
 * セットアップ画面の JSX 配置のみを担う純粋な表示コンポーネント。
 * 状態は持たず、すべて props 経由で受け取る。
 */
export const SetupLayout = ({
  playerInputs,
  onNameChange,
  umaPresets,
  umaIndex,
  onSelectUma,
  returnPointOptions,
  returnPoint,
  onSelectReturnPoint,
  isConfigOpen,
  onToggleConfig,
  canStart,
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
        {playerInputs.map((field, index) => (
          <label key={field.id} className="block space-y-2">
            <span className="text-2xl text-neutral-400">{field.label}</span>
            <input
              type="text"
              value={field.value}
              onChange={(e) => onNameChange(field.id, e.target.value)}
              className="w-full rounded-lg bg-neutral-800 px-6 py-4 text-3xl text-neutral-100 outline-none focus:ring-4 focus:ring-emerald-500"
              placeholder={field.placeholder}
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
              {umaPresets[umaIndex]?.label ?? ''} / {returnPoint.toLocaleString('en-US')}点返し
            </span>
          </h2>
          <ChevronDown
            size={24}
            className={`text-neutral-400 transition-transform ${isConfigOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isConfigOpen && (
          <div className="space-y-4 border-t border-neutral-800 px-6 pb-6 pt-4">
            <div className="space-y-2">
              <span className="text-xl text-neutral-400">順位点</span>
              <div className="flex gap-3">
                {umaPresets.map((preset, index) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onSelectUma(index)}
                    className={buildSelectableButtonClass(umaIndex === index)}
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
                    className={buildSelectableButtonClass(returnPoint === point)}
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
        disabled={!canStart}
        onClick={onStart}
        className="w-full rounded-lg bg-emerald-700 py-6 text-4xl font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
      >
        対局開始
      </button>
    </div>
  </div>
);
