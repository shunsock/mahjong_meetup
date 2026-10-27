import type { ReactNode } from 'react';

type TopBarButtonProps = Readonly<{
  icon: ReactNode;
  label: string;
  onClick: () => void;
  hoverClass: string;
}>;

/**
 * 画面右上に並ぶアイコン付きの小さいボタン (リセット・対戦終了 等)。
 */
export const TopBarButton = ({ icon, label, onClick, hoverClass }: TopBarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-lg font-bold text-neutral-400 transition ${hoverClass}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
