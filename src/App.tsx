import { useEffect } from 'react';
import AppShell from './ui/AppShell';
import { loadGame, saveGame } from './game/save/save';
import { useGameStore } from './game/state/store';

function App() {
  useEffect(() => {
    loadGame().then((state) => {
      if (state) {
        useGameStore.setState(state);
      }
    });

    const save = debounce(async () => {
      const updated = await saveGame(useGameStore.getState());
      useGameStore.setState(updated);
    }, 500);

    const interval = setInterval(save, 10000);
    const onVisibility = () => {
      if (document.hidden) {
        save();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <AppShell />;
}

export default App;

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}
