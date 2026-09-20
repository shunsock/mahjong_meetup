import { PLAYER_IDS, type Player, type PlayerId } from '../../domain/player';

/**
 * セットアップ画面が保持するプレイヤー名の入力状態。
 * PlayerId ごとに 1 つの名前 (未確定な生の文字列) を持つ。
 */
export type PlayerNameMap = Readonly<Record<PlayerId, string>>;

export const EMPTY_PLAYER_NAMES: PlayerNameMap = {
  p1: '',
  p2: '',
  p3: '',
  p4: '',
};

/** domain の PLAYER_IDS を usecase 境界として提供する。 */
export const loadPlayerIds = (): ReadonlyArray<PlayerId> => PLAYER_IDS;

/** 全プレイヤーの名前が trim 後 1 文字以上であれば true。 */
export const isEveryPlayerNameFilled = (names: PlayerNameMap): boolean =>
  loadPlayerIds().every((id) => names[id].trim().length > 0);

/** PLAYER_IDS の順序で、trim 済みの名前を持つ Player の並びを組み立てる。 */
export const buildPlayers = (names: PlayerNameMap): ReadonlyArray<Player> =>
  loadPlayerIds().map((id) => ({ id, name: names[id].trim() }));
