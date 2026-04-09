import type { Points } from '../../domain/movement';

type Props = Readonly<{
  label: string;
  presets: ReadonlyArray<Points>;
  value: Points | null;
  onSelect: (points: Points) => void;
}>;

const formatPoints = (p: Points): string => p.toLocaleString('en-US');

/**
 * 点数選択 UI。プリセットボタンと自由入力の両方を提供する。
 */
export const ScoreInput = ({ label, presets, value, onSelect }: Props) => {
  const isCustom = value !== null && !presets.includes(value);

  return (
    <div className="space-y-3">
      <div className="text-2xl text-neutral-400">{label}</div>
      <div className="grid grid-cols-5 gap-3">
        {presets.map((preset) => {
          const isSelected = value === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onSelect(preset)}
              className={`rounded-xl py-4 font-mono text-2xl font-bold tabular-nums transition ${
                isSelected
                  ? 'bg-sky-600 text-white ring-4 ring-sky-300'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
              }`}
            >
              {formatPoints(preset)}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 pt-2">
        <span className="text-xl text-neutral-500">自由入力:</span>
        <input
          type="number"
          min={0}
          step={100}
          value={isCustom && value !== null ? value : ''}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') return;
            const n = Number(raw);
            if (Number.isFinite(n) && n >= 0) onSelect(n);
          }}
          placeholder="任意の点数"
          className={`flex-1 rounded-xl px-4 py-3 font-mono text-2xl tabular-nums outline-none ${
            isCustom
              ? 'bg-sky-900 text-white ring-4 ring-sky-300'
              : 'bg-neutral-800 text-neutral-200 focus:ring-2 focus:ring-sky-500'
          }`}
        />
      </div>
    </div>
  );
};
