import { useState } from 'react';
import type { Player } from '../domain/player';
import { SetupScreen } from './SetupScreen';
import { Dashboard } from './Dashboard';

/**
 * アプリのルート。起動時は SetupScreen で名前を入力し、
 * 確定後に Dashboard に遷移する。リセット時は再び SetupScreen へ。
 */
export const App = () => {
  const [players, setPlayers] = useState<ReadonlyArray<Player> | null>(null);

  if (players === null) {
    return <SetupScreen onStart={setPlayers} />;
  }

  return (
    <Dashboard
      players={players}
      onReset={() => setPlayers(null)}
    />
  );
};
