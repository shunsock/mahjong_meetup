import type { Player } from '../../domain/player';
import type { Scoreboard } from '../../domain/scoreboard';
import type { Points } from '../../domain/movement';
import { calcFinalScore, type FinalScoreConfig } from '../../domain/final-score';

/** 順位・持ち点・最終得点を付与したプレイヤーの結果エントリ。 */
export type RankedFinalScore = Readonly<{
  player: Player;
  score: Points;
  rank: number;
  finalScore: number;
}>;

/**
 * 持ち点で降順ソートし、同点は元の並び順を保ったまま順位と最終得点を付与する。
 *
 * @param board 順位付けの対象となるスコアボード。
 * @param config 最終得点の算出に用いるウマ・返し点設定。
 * @returns 順位順に並んだ RankedFinalScore の配列。
 */
export const rankFinalScores = (
  board: Scoreboard,
  config: FinalScoreConfig,
): ReadonlyArray<RankedFinalScore> => {
  const withScores = board.players.map((player) => ({
    player,
    score: board.scores[player.id],
  }));
  const sorted = [...withScores].sort((a, b) => b.score - a.score);
  return sorted.map((entry, index) => {
    const rank = index + 1;
    return {
      player: entry.player,
      score: entry.score,
      rank,
      finalScore: calcFinalScore(entry.score, rank, config),
    };
  });
};
