type Props = Readonly<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}>;

/**
 * 本場・供託など 0 以上の整数を +1 / -1 / リセットで操作するコントロール。
 */
export const CounterInput = ({ label, value, onChange }: Props) => (
  <div className="flex items-center gap-4">
    <span className="w-20 text-2xl text-neutral-400">{label}</span>
    <span className="w-16 text-center font-mono text-3xl font-bold tabular-nums text-white">
      {value}
    </span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="rounded-xl bg-neutral-800 px-5 py-3 text-2xl font-bold text-neutral-200 transition hover:bg-neutral-700"
    >
      +1
    </button>
    <button
      type="button"
      onClick={() => onChange(Math.max(0, value - 1))}
      className="rounded-xl bg-neutral-800 px-5 py-3 text-2xl font-bold text-neutral-200 transition hover:bg-neutral-700"
    >
      -1
    </button>
    <button
      type="button"
      onClick={() => onChange(0)}
      className="rounded-xl bg-neutral-800 px-5 py-3 text-2xl font-bold text-neutral-200 transition hover:bg-neutral-700"
    >
      0
    </button>
  </div>
);
