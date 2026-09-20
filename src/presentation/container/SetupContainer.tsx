import { useState } from 'react';
import type { Player, PlayerId } from '../../domain/player';
import type { FinalScoreConfig } from '../../domain/final-score';
import {
  buildPlayers,
  EMPTY_PLAYER_NAMES,
  isEveryPlayerNameFilled,
  loadPlayerIds,
  type PlayerNameMap,
} from '../../usecase/setup/build-players';
import { buildFinalScoreConfig } from '../../usecase/setup/build-final-score-config';
import {
  loadDefaultReturnPoint,
  loadDefaultUmaIndex,
  loadReturnPointOptions,
  loadUmaPresets,
} from '../../usecase/setup/load-final-score-options';
import { SetupLayout, type PlayerInputField } from '../layout/SetupLayout';

export type Props = Readonly<{
  onStart: (
    players: ReadonlyArray<Player>,
    config: FinalScoreConfig,
  ) => void;
}>;

const toPlayerInputFields = (
  names: PlayerNameMap,
): ReadonlyArray<PlayerInputField> =>
  loadPlayerIds().map((id, index) => {
    const displayNumber = index + 1;
    return {
      id,
      label: `Player ${displayNumber}`,
      placeholder: `プレイヤー${displayNumber}`,
      value: names[id],
    };
  });

/**
 * セットアップ画面の状態と usecase 呼び出しを担う。
 * 表示は SetupLayout に委譲し、自身は state と effect のみを持つ。
 */
export const SetupContainer = ({ onStart }: Props) => {
  const [names, setNames] = useState<PlayerNameMap>(EMPTY_PLAYER_NAMES);
  const [umaIndex, setUmaIndex] = useState(loadDefaultUmaIndex());
  const [returnPoint, setReturnPoint] = useState(loadDefaultReturnPoint());
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const canStart = isEveryPlayerNameFilled(names);

  const handleNameChange = (id: PlayerId, value: string) =>
    setNames((prev) => ({ ...prev, [id]: value }));

  const handleStart = () => {
    if (!canStart) return;
    onStart(buildPlayers(names), buildFinalScoreConfig(umaIndex, returnPoint));
  };

  return (
    <SetupLayout
      playerInputs={toPlayerInputFields(names)}
      onNameChange={handleNameChange}
      umaPresets={loadUmaPresets()}
      umaIndex={umaIndex}
      onSelectUma={setUmaIndex}
      returnPointOptions={loadReturnPointOptions()}
      returnPoint={returnPoint}
      onSelectReturnPoint={setReturnPoint}
      isConfigOpen={isConfigOpen}
      onToggleConfig={() => setIsConfigOpen((prev) => !prev)}
      canStart={canStart}
      onStart={handleStart}
    />
  );
};
