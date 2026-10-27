import { PLAYER_IDS, type Player, type PlayerId } from '../../domain/player';

export { PLAYER_IDS } from '../../domain/player';

/**
 * セットアップ画面で入力された名前から Player の配列を組み立てる。
 *
 * @param names PlayerId ごとの入力名。前後のスペースは除去される。
 * @returns PLAYER_IDS (p1→p4) の順序で並んだ Player の配列。
 */
export const buildPlayers = (
  names: Readonly<Record<PlayerId, string>>,
): ReadonlyArray<Player> =>
  PLAYER_IDS.map((id) => ({
    id,
    name: names[id].trim(),
  }));
