import type { Player, PlayerId } from '../../../domain/player';

type Props = Readonly<{
  label: string;
  players: ReadonlyArray<Player>;
  selected: PlayerId | null;
  onSelect: (id: PlayerId) => void;
  disabledIds?: ReadonlyArray<PlayerId>;
}>;

/**
 * プレイヤーを 1 人選ぶためのボタングループ。
 * disabledIds に入った ID は選択不可 (例: ロンで和了者を選んだ後の放銃者選択)。
 */
export const PlayerSelector = ({
  label,
  players,
  selected,
  onSelect,
  disabledIds = [],
}: Props) => (
  <div className="space-y-3">
    <div className="text-2xl text-neutral-400">{label}</div>
    <div className="grid grid-cols-4 gap-3">
      {players.map((player) => {
        const isDisabled = disabledIds.includes(player.id);
        const isSelected = selected === player.id;
        return (
          <button
            key={player.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelect(player.id)}
            className={`truncate rounded-xl px-4 py-5 text-3xl font-bold transition ${
              isSelected
                ? 'bg-emerald-700 text-white ring-4 ring-emerald-400'
                : isDisabled
                  ? 'bg-neutral-800 text-neutral-600'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
            }`}
          >
            {player.name}
          </button>
        );
      })}
    </div>
  </div>
);
