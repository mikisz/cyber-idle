import { useEffect, useState } from 'react';
import { useGameStore, getDistrictById } from '../../game/state/store';
import { getHackingAction } from '../../data/hacking';
import { getDistrictActionDuration } from '../../game/district';
import ProgressBarNeon from './ProgressBarNeon';

export default function ActiveActionBar() {
  const hackingState = useGameStore((s) => s.hackingState);
  const districtRuntime = useGameStore((s) => s.districtRuntime);
  const activeDistrictId = useGameStore((s) => s.world.activeDistrictId);
  const gameState = useGameStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  let name: string | null = null;
  let icon: string | null = null;
  let startedAt: number | undefined;
  let duration = 0;

  if (hackingState.isRunning && hackingState.currentActionId) {
    const action = getHackingAction(hackingState.currentActionId);
    if (action) {
      name = action.name;
      icon = action.iconText;
      startedAt = hackingState.lastStartAt;
      duration = action.baseDurationMs /
        gameState.hacking.timeMultiplier /
        gameState.bonuses.hackingSpeed;
    }
  } else if (districtRuntime.isRunning && districtRuntime.runningActionId && activeDistrictId) {
    const district = getDistrictById(activeDistrictId);
    const action = district?.actions.find((a) => a.id === districtRuntime.runningActionId);
    if (district && action) {
      name = action.name;
      icon = action.iconText ?? null;
      startedAt = districtRuntime.startedAt;
      duration = getDistrictActionDuration(action, gameState);
    }
  }

  if (!name || !startedAt) return null;

  const progress = Math.min(100, ((now - startedAt) / duration) * 100);
  const remaining = Math.max(0, duration - (now - startedAt));
  const seconds = (remaining / 1000).toFixed(1);

  return (
    <div className="fixed bottom-12 md:bottom-0 left-0 md:left-20 right-0 z-20 bg-gray-900/90 p-2">
      <div className="flex items-center gap-2 text-sm text-neon-cyan">
        {icon && <span>{icon}</span>}
        <span className="flex-1 truncate">{name}</span>
        <span>{seconds}s</span>
      </div>
      <ProgressBarNeon percentage={progress} />
    </div>
  );
}
