type Props = Readonly<{
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}>;

/**
 * 本場など 0 以上の整数を +1 / -1 / リセットで操作するコントロール。
 * 値の操作ロジックは呼び出し側が担う。
 */
export const CounterInput = ({
  label,
  value,
  onIncrement,
  onDecrement,
  onReset,
}: Props) => (
  <div className="flex items-center gap-4">
    <span className="w-20 text-2xl text-neutral-400">{label}</span>
    <span className="w-16 text-center font-mono text-3xl font-bold tabular-nums text-white">
      {value}
    </span>
    <button
      type="button"
      onClick={onIncrement}
      className="rounded-xl bg-neutral-800 px-5 py-3 text-2xl font-bold text-neutral-200 transition hover:bg-neutral-700"
    >
      +1
    </button>
    <button
      type="button"
      onClick={onDecrement}
      className="rounded-xl bg-neutral-800 px-5 py-3 text-2xl font-bold text-neutral-200 transition hover:bg-neutral-700"
    >
      -1
    </button>
    <button
      type="button"
      onClick={onReset}
      className="rounded-xl bg-neutral-800 px-5 py-3 text-2xl font-bold text-neutral-200 transition hover:bg-neutral-700"
    >
      0
    </button>
  </div>
);
