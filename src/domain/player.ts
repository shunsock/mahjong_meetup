/**
 * プレイヤーの識別子と定義。
 *
 * PlayerId は 4 人打ち麻雀の固定 ID (p1〜p4)。
 * 席順 (東/南/西/北) や親/子の状態はこのアプリでは扱わない
 * (自動卓に委譲する)。
 */

export type PlayerId = 'p1' | 'p2' | 'p3' | 'p4';

export const PLAYER_IDS: ReadonlyArray<PlayerId> = ['p1', 'p2', 'p3', 'p4'] as const;

export type Player = Readonly<{
  id: PlayerId;
  name: string;
}>;
