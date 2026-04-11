import { type Points } from '../../domain/movement';

const HAN_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110] as const;

type Props = Readonly<{
  han: number | null;
  fu: number | null;
  onHanSelect: (han: number) => void;
  onFuSelect: (fu: number) => void;
  /** 翻・符から算出された点数。未確定なら null。 */
  calculatedScore: Points | null;
}>;

/**
 * 翻・符を選択して点数を算出する入力コントロール。
 */
export const HanFuInput = ({
  han,
  fu,
  onHanSelect,
  onFuSelect,
  calculatedScore,
}: Props) => (
  <div className="space-y-6">
    <div className="space-y-3">
      <div className="text-2xl text-neutral-400">翻</div>
      <div className="grid grid-cols-7 gap-2">
        {HAN_OPTIONS.map((h) => (
          <OptionButton
            key={h}
            label={`${h}`}
            active={han === h}
            onClick={() => onHanSelect(h)}
          />
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <div className="text-2xl text-neutral-400">符</div>
      <div className="grid grid-cols-6 gap-2">
        {FU_OPTIONS.map((f) => (
          <OptionButton
            key={f}
            label={`${f}`}
            active={fu === f}
            onClick={() => onFuSelect(f)}
          />
        ))}
      </div>
    </div>

    <div className="flex items-center gap-4">
      <span className="text-2xl text-neutral-400">点数</span>
      <span className="font-mono text-3xl font-bold tabular-nums text-white">
        {calculatedScore !== null
          ? calculatedScore.toLocaleString('en-US')
          : '—'}
      </span>
    </div>
  </div>
);

const OptionButton = ({
  label,
  active,
  onClick,
}: Readonly<{ label: string; active: boolean; onClick: () => void }>) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl py-3 text-2xl font-bold transition ${
      active
        ? 'bg-emerald-700 text-white ring-4 ring-emerald-400'
        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
    }`}
  >
    {label}
  </button>
);
