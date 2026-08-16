import { useState } from 'react';
import type { Player } from '../domain/player';
import type { Scoreboard } from '../domain/scoreboard';
import type { FinalScoreConfig } from '../domain/final-score';
import { SetupScreen } from './screen/SetupScreen';
import { DashboardScreen } from './screen/DashboardScreen';
import { ResultScreen } from './ResultScreen';

type AppState =
  | Readonly<{ kind: 'setup' }>
  | Readonly<{ kind: 'playing'; players: ReadonlyArray<Player>; config: FinalScoreConfig }>
  | Readonly<{ kind: 'result'; board: Scoreboard; config: FinalScoreConfig }>;

/**
 * アプリのルート。起動時は SetupScreen で名前とウマオカを設定し、
 * 確定後に Dashboard に遷移する。
 * 対戦終了で ResultScreen、リセットで SetupScreen へ。
 */
export const App = () => {
  const [state, setState] = useState<AppState>({ kind: 'setup' });

  switch (state.kind) {
    case 'setup':
      return (
        <SetupScreen
          onStart={(players, config) =>
            setState({ kind: 'playing', players, config })
          }
        />
      );
    case 'playing':
      return (
        <DashboardScreen
          players={state.players}
          onReset={() => setState({ kind: 'setup' })}
          onEndMatch={(board) =>
            setState({ kind: 'result', board, config: state.config })
          }
        />
      );
    case 'result':
      return (
        <ResultScreen
          board={state.board}
          config={state.config}
          onBackToSetup={() => setState({ kind: 'setup' })}
        />
      );
  }
};
