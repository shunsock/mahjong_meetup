import { Modal } from './Modal';

type Props = Readonly<{
  onConfirm: () => void;
  onCancel: () => void;
}>;

/**
 * リセット確認ダイアログ。誤押防止のための確認ステップ。
 */
export const ResetDialog = ({ onConfirm, onCancel }: Props) => (
  <Modal
    title="対局をリセット"
    onCancel={onCancel}
    onConfirm={onConfirm}
    confirmLabel="リセットする"
  >
    <div className="space-y-4 py-4">
      <p className="text-3xl text-neutral-200">
        現在の対局を破棄して、プレイヤー名入力に戻ります。
      </p>
      <p className="text-2xl text-red-400">
        この操作は取り消せません。
      </p>
    </div>
  </Modal>
);
