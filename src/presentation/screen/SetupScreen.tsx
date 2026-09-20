import { SetupContainer, type Props } from '../container/SetupContainer';

/**
 * プレイヤー名・ウマオカの入力画面。SetupContainer を composition するのみ。
 */
export const SetupScreen = ({ onStart }: Props) => (
  <SetupContainer onStart={onStart} />
);
