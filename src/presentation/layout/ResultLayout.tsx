import type { ComponentProps } from 'react';
import { PointStickDivider } from '../component/PointStickDivider';
import { RankingRow } from '../component/RankingRow';
import type { FinalScoreConfig } from '../../domain/final-score';

type Props = Readonly<{
  ranked: ReadonlyArray<ComponentProps<typeof RankingRow> & Readonly<{ id: string }>>;
  config: FinalScoreConfig;
  onBackToSetup: () => void;
}>;

const formatUmaLabel = (config: FinalScoreConfig): string => {
  const abs = config.placementBonus.map(Math.abs);
  const min = Math.min(...abs);
  const max = Math.max(...abs);
  return `${min}-${max}`;
};

/**
 * 対戦結果画面の見た目のみを担う純粋な表示コンポーネント。
 * 状態を持たず、すべての値とハンドラを props で受け取る。
 */
export const ResultLayout = ({ ranked, config, onBackToSetup }: Props) => (
  <div className="flex h-full flex-col items-center justify-center bg-neutral-950 p-6">
    <h1 className="mb-4 text-5xl font-bold text-neutral-100">
      対戦結果
    </h1>

    <div className="mb-6 w-full max-w-3xl">
      <PointStickDivider />
    </div>

    <div className="w-full max-w-3xl space-y-4">
      {ranked.map((entry) => (
        <RankingRow
          key={entry.id}
          name={entry.name}
          score={entry.score}
          rank={entry.rank}
          finalScore={entry.finalScore}
        />
      ))}
    </div>

    <div className="mt-6 w-full max-w-3xl">
      <PointStickDivider />
    </div>

    <p className="mt-2 text-lg text-neutral-500">
      {formatUmaLabel(config)} / {config.returnPoint.toLocaleString('en-US')}点返し
    </p>

    <button
      type="button"
      onClick={onBackToSetup}
      className="mt-6 rounded-xl bg-emerald-700 px-16 py-5 text-3xl font-bold text-white transition hover:bg-emerald-600"
    >
      トップに戻る
    </button>
  </div>
);
