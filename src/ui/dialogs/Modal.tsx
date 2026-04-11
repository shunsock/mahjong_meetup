import type { ReactNode } from 'react';

type Props = Readonly<{
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  confirmLabel?: string;
}>;

/**
 * ダイアログの共通外枠。フォーム本体は children として渡す。
 * Escape キーでのキャンセル・Enter での確定はあえて実装しない
 * (大画面での誤操作を防ぐため、明示的クリックを要求する)。
 */
export const Modal = ({
  title,
  children,
  onCancel,
  onConfirm,
  confirmDisabled = false,
  confirmLabel = '確定',
}: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
    <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-700">
      <header className="border-b border-neutral-800 px-8 py-6">
        <h2 className="text-4xl font-bold text-neutral-100">{title}</h2>
      </header>
      <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
      <footer className="flex gap-4 border-t border-neutral-800 px-8 py-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl bg-neutral-700 py-4 text-3xl font-bold text-white hover:bg-neutral-600"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmDisabled}
          className="flex-1 rounded-xl bg-emerald-700 py-4 text-3xl font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
        >
          {confirmLabel}
        </button>
      </footer>
    </div>
  </div>
);
