import { Modal } from './Modal';

type Props = Readonly<{
  onConfirm: () => void;
  onCancel: () => void;
}>;

/**
 * 対戦終了確認ダイアログ。結果画面への遷移前に確認を行う。
 */
export const EndMatchDialog = ({ onConfirm, onCancel }: Props) => (
  <Modal
    title="対戦終了"
    onCancel={onCancel}
    onConfirm={onConfirm}
    confirmLabel="はい"
  >
    <div className="py-4">
      <p className="text-3xl text-neutral-200">
        対戦を終了しますか？
      </p>
    </div>
  </Modal>
);
