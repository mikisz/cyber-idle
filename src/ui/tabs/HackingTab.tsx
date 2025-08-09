import { useEffect, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { BASE_HACK_DURATION, performHack } from '../../game/hacking';
import { addItemToInventory } from '../../game/items';
import { getNextLevelXp } from '../../game/skills';

export default function HackingTab() {
  const hacking = useGameStore((s) => s.skills.hacking);
  const timeMultiplier = useGameStore((s) => s.hacking.timeMultiplier);
  const setState = useGameStore.setState;

  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inProgress) return;

    const duration = BASE_HACK_DURATION / timeMultiplier;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);

        let loot: string | null = null;
        setState((state) => {
          const { state: updated, loot: drop } = performHack(state);
          loot = drop ?? null;
          return { ...updated, hacking: { ...updated.hacking, inProgress: false } };
        });
        if (loot) addItemToInventory(loot);

        setInProgress(false);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [inProgress, setState, timeMultiplier]);

  const xpNeeded = getNextLevelXp(hacking.level);

  const startHack = () => {
    if (!inProgress) {
      setInProgress(true);
      setState((s) => ({
        ...s,
        hacking: { ...s.hacking, inProgress: true },
      }));
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>Level: {hacking.level}</div>
      <div>
        XP: {hacking.xp} / {xpNeeded}
      </div>
      {inProgress && (
        <div className="h-4 w-full bg-gray-800" role="progressbar">
          <div
            className="h-full bg-neon-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <button onClick={startHack} disabled={inProgress}>
        Start hack
      </button>
    </div>
  );
}
