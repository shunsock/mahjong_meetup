import { useState } from 'react';
import { buildPlayers, PLAYER_IDS } from '../../usecase/setup/build-players';
import { buildFinalScoreConfig } from '../../usecase/setup/build-final-score-config';
import {
  UMA_PRESETS,
  DEFAULT_CONFIG,
} from '../../usecase/setup/load-final-score-options';
import type { Player, PlayerId } from '../../domain/player';
import type { FinalScoreConfig } from '../../domain/final-score';
import { SetupLayout } from '../layout/SetupLayout';

type Props = Readonly<{
  onStart: (
    players: ReadonlyArray<Player>,
    config: FinalScoreConfig,
  ) => void;
}>;

type NameMap = Readonly<Record<PlayerId, string>>;

const emptyNames: NameMap = { p1: '', p2: '', p3: '', p4: '' };

const RETURN_POINT_OPTIONS = [25000, 30000] as const;

/**
 * プレイヤー名・ウマオカ入力の状態管理を担う。
 * 4 人全員の名前が入力されるまで「開始」ボタンは無効化される。
 */
export const SetupContainer = ({ onStart }: Props) => {
  const [names, setNames] = useState<NameMap>(emptyNames);
  const [umaIndex, setUmaIndex] = useState(
    UMA_PRESETS.findIndex((p) => p.label === '10-30'),
  );
  const [returnPoint, setReturnPoint] = useState(DEFAULT_CONFIG.returnPoint);
  const [configOpen, setConfigOpen] = useState(false);

  const allFilled = PLAYER_IDS.every((id) => names[id].trim().length > 0);

  const handleStart = () => {
    if (!allFilled) return;
    onStart(buildPlayers(names), buildFinalScoreConfig(umaIndex, returnPoint));
  };

  return (
    <SetupLayout
      names={names}
      playerIds={PLAYER_IDS}
      umaIndex={umaIndex}
      returnPoint={returnPoint}
      configOpen={configOpen}
      allFilled={allFilled}
      umaPresets={UMA_PRESETS}
      returnPointOptions={RETURN_POINT_OPTIONS}
      onNameChange={(id, value) =>
        setNames((prev) => ({ ...prev, [id]: value }))
      }
      onToggleConfig={() => setConfigOpen((prev) => !prev)}
      onSelectUma={setUmaIndex}
      onSelectReturnPoint={setReturnPoint}
      onStart={handleStart}
    />
  );
};
