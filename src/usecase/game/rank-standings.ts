import type { Player } from '../../domain/player';
import type { Scoreboard } from '../../domain/scoreboard';

export type DeltaEntry = Readonly<{
  name: string;
  delta: number;
}>;

export type RankedPlayer = Readonly<{
  player: Player;
  score: number;
  rank: number;
  deltas: ReadonlyArray<DeltaEntry>;
}>;

/**
 * 持ち点で降順ソートし、同点は元の並び順を保ったまま順位を付与する。
 * 各プレイヤーに対して他全員との点差を順位順で算出する。
 *
 * @param board 順位付けの対象となるスコアボード。
 * @returns 順位順に並んだ RankedPlayer の配列。
 */
export const rankStandings = (
  board: Scoreboard,
): ReadonlyArray<RankedPlayer> => {
  const withScores = board.players.map((player) => ({
    player,
    score: board.scores[player.id],
  }));
  const sorted = [...withScores].sort((a, b) => b.score - a.score);
  return sorted.map((entry, index) => ({
    player: entry.player,
    score: entry.score,
    rank: index + 1,
    deltas: sorted
      .filter((other) => other.player.id !== entry.player.id)
      .map((other) => ({
        name: other.player.name,
        delta: entry.score - other.score,
      })),
  }));
};
