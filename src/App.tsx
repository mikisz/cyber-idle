import { useEffect } from 'react';
import AppShell from './ui/AppShell';
import { loadGame, saveGame } from './game/save/save';
import { useGameStore } from './game/state/store';
import { applyOfflineProgress, MAX_OFFLINE_MS } from './game/offline';
import { showToast } from './ui/Toast';

function App() {
  useEffect(() => {
    loadGame().then((state) => {
      const now = Date.now();
      if (state) {
        if (state.combat?.inFight) {
          state = {
            ...state,
            combat: { enemyId: null, enemyHp: 0, inFight: false, log: [] },
          };
        }

        if (state.meta.lastSaveTimestamp) {
          const delta = now - state.meta.lastSaveTimestamp;
          const { state: withOffline, rewards } = applyOfflineProgress(state, delta);
          state = withOffline;
          const effective = Math.min(delta, MAX_OFFLINE_MS);
          if (effective >= 60_000) {
            const mins = Math.floor(delta / 60000);
            const hrs = Math.floor(mins / 60);
            const remMins = mins % 60;
            const parts: string[] = [];
            if (rewards.credits) parts.push(`${rewards.credits} Credits`);
            if (rewards.data) parts.push(`${rewards.data} Data`);
            if (rewards.xp) parts.push(`${rewards.xp} XP`);
            const summary = parts.length ? parts.join(', ') : 'nothing';
            showToast(`While you were away for ${hrs}h ${remMins}m, you earned: ${summary}`);
          }
        }

        state = { ...state, meta: { ...state.meta, lastSaveTimestamp: now } };
        useGameStore.setState(state);
      } else {
        useGameStore.setState((s) => ({
          ...s,
          meta: { ...s.meta, lastSaveTimestamp: now },
        }));
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
