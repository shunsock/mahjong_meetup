type ActionBarProps = Readonly<{
  canUndo: boolean;
  onRon: () => void;
  onTsumo: () => void;
  onRyukyoku: () => void;
  onRiichi: () => void;
  onUndo: () => void;
}>;

/**
 * 対局操作 (リーチ・ロン・ツモ・流局・Undo) のボタン列。
 */
export const ActionBar = ({
  canUndo,
  onRon,
  onTsumo,
  onRyukyoku,
  onRiichi,
  onUndo,
}: ActionBarProps) => (
  <div className="mt-6 flex gap-4">
    <ActionButton label="リーチ" onClick={onRiichi} variant="primary" />
    <ActionButton label="ロン" onClick={onRon} variant="primary" />
    <ActionButton label="ツモ" onClick={onTsumo} variant="primary" />
    <ActionButton label="流局" onClick={onRyukyoku} variant="primary" />
    <ActionButton
      label="Undo"
      onClick={onUndo}
      variant="secondary"
      disabled={!canUndo}
    />
  </div>
);

type ActionButtonProps = Readonly<{
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
  disabled?: boolean;
}>;

const buttonVariantClass = (variant: ActionButtonProps['variant']): string => {
  switch (variant) {
    case 'primary':
      return 'bg-emerald-700 hover:bg-emerald-600';
    case 'secondary':
      return 'bg-neutral-700 hover:bg-neutral-600';
  }
};

const ActionButton = ({
  label,
  onClick,
  variant,
  disabled = false,
}: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 rounded-xl py-6 text-4xl font-bold text-white transition disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600 ${buttonVariantClass(
      variant,
    )}`}
  >
    {label}
  </button>
);
