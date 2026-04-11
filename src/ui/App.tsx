import { useState } from 'react';
import type { Player } from '../domain/player';
import type { Scoreboard } from '../domain/scoreboard';
import { SetupScreen } from './SetupScreen';
import { Dashboard } from './Dashboard';
import { ResultScreen } from './ResultScreen';

type AppState =
  | Readonly<{ kind: 'setup' }>
  | Readonly<{ kind: 'playing'; players: ReadonlyArray<Player> }>
  | Readonly<{ kind: 'result'; board: Scoreboard }>;

/**
 * アプリのルート。起動時は SetupScreen で名前を入力し、
 * 確定後に Dashboard に遷移する。
 * 対戦終了で ResultScreen、リセットで SetupScreen へ。
 */
export const App = () => {
  const [state, setState] = useState<AppState>({ kind: 'setup' });

  switch (state.kind) {
    case 'setup':
      return (
        <SetupScreen
          onStart={(players) => setState({ kind: 'playing', players })}
        />
      );
    case 'playing':
      return (
        <Dashboard
          players={state.players}
          onReset={() => setState({ kind: 'setup' })}
          onEndMatch={(board) => setState({ kind: 'result', board })}
        />
      );
    case 'result':
      return (
        <ResultScreen
          board={state.board}
          onBackToSetup={() => setState({ kind: 'setup' })}
        />
      );
  }
};
