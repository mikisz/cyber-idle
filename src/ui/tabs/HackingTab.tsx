import { useEffect, useState } from 'react';
import { useGameStore } from '../../game/state/store';

const HACK_DURATION = 10000; // ms

export default function HackingTab() {
  const hacking = useGameStore((s) => s.skills.hacking);
  const setState = useGameStore.setState;

  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inProgress) return;

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / HACK_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= HACK_DURATION) {
        clearInterval(interval);

        const rewardCredits = 50 + Math.floor(Math.random() * 101); // 50-150
        const rewardXp = 5 + Math.floor(Math.random() * 11); // 5-15

        setState((state) => {
          let { level, xp } = state.skills.hacking;
          xp += rewardXp;
          while (xp >= level * 100) {
            xp -= level * 100;
            level += 1;
          }

          return {
            ...state,
            player: {
              ...state.player,
              credits: state.player.credits + rewardCredits,
            },
            skills: {
              ...state.skills,
              hacking: { level, xp },
            },
          };
        });

        setInProgress(false);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [inProgress, setState]);

  const xpNeeded = hacking.level * 100;

  const startHack = () => {
    if (!inProgress) {
      setInProgress(true);
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
