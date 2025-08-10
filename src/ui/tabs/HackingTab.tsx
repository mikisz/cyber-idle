import { useEffect, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { hackingActions, getHackingAction } from '../../data/hacking';
import { startHacking, stopHacking } from '../../game/hacking';
import Card from '../components/Card';
import ButtonNeon from '../components/ButtonNeon';
import ProgressBarNeon from '../components/ProgressBarNeon';
import SectionHeader from '../components/SectionHeader';

export default function HackingTab() {
  const hackingSkill = useGameStore((s) => s.skills.hacking);
  const hackingState = useGameStore((s) => s.hackingState);
  const timeMultiplier = useGameStore((s) => s.hacking.timeMultiplier);
  const bonusSpeed = useGameStore((s) => s.bonuses.hackingSpeed);

  const [selected, setSelected] = useState<string | null>(
    hackingState.currentActionId ?? hackingActions[0].id,
  );

  const currentAction = hackingState.currentActionId
    ? getHackingAction(hackingState.currentActionId)
    : null;

  const effectiveDuration = currentAction
    ? currentAction.baseDurationMs / (timeMultiplier * bonusSpeed)
    : 0;

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!hackingState.isRunning || !currentAction) {
      setProgress(0);
      return;
    }
    const interval = setInterval(() => {
      const elapsed = Date.now() - (hackingState.lastStartAt ?? 0);
      const pct = Math.min((elapsed / effectiveDuration) * 100, 100);
      setProgress(pct);
    }, 100);
    return () => clearInterval(interval);
  }, [hackingState.isRunning, hackingState.lastStartAt, effectiveDuration, currentAction]);

  const handleStartStop = () => {
    if (hackingState.isRunning) {
      stopHacking();
    } else if (selected) {
      startHacking(selected);
    }
  };

  const previewRewards = (actionId: string) => {
    const action = getHackingAction(actionId);
    if (!action) return '';
    const parts = [`${action.rewards.credits.min}-${action.rewards.credits.max}¢`];
    if (action.rewards.data)
      parts.push(
        `${action.rewards.data.min}-${action.rewards.data.max}🧬`,
      );
    parts.push(`${action.rewards.xp} XP`);
    return parts.join(', ');
  };

  return (
    <Card className="space-y-4 p-4">
      <SectionHeader>Hacking</SectionHeader>
      <div>Level: {hackingSkill.level}</div>
      <div>XP: {hackingSkill.xp}</div>
      <div className="grid grid-cols-1 gap-2">
        {hackingActions.map((action) => {
          const disabled = hackingSkill.level < action.minLevel;
          const isSelected = selected === action.id;
          return (
            <button
              key={action.id}
              disabled={disabled || hackingState.isRunning}
              onClick={() => setSelected(action.id)}
              className={`flex items-center gap-2 border p-2 text-left ${
                disabled
                  ? 'opacity-50'
                  : isSelected
                  ? 'border-neon-magenta'
                  : ''
              }`}
            >
              <span>{action.iconText}</span>
              <div className="flex-1">
                <div>{action.name}</div>
                <div className="text-xs">
                  L{action.minLevel} · {(action.baseDurationMs / 1000).toFixed(1)}s ·{' '}
                  {previewRewards(action.id)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {hackingState.isRunning && currentAction && (
        <>
          <ProgressBarNeon percentage={progress} />
          <div className="text-sm">
            {currentAction.name} — {previewRewards(currentAction.id)}
          </div>
        </>
      )}
      <ButtonNeon onClick={handleStartStop} disabled={!selected && !hackingState.isRunning}>
        {hackingState.isRunning ? 'Stop' : 'Start'}
      </ButtonNeon>
    </Card>
  );
}
