import { useGameStore, type GameState } from './state/store';
import { getHackingAction, type HackingAction } from '../data/hacking';
import { gainSkillXpState } from './skills';
import { rollCredits, rollLoot, grantLoot } from './loot';
import { showToast } from '../ui/Toast';

let hackingTimer: ReturnType<typeof setTimeout> | null = null;

function getSpeedMultiplier(state: GameState): number {
  return state.hacking.timeMultiplier * state.bonuses.hackingSpeed;
}

function getEffectiveDuration(action: HackingAction, state: GameState): number {
  return action.baseDurationMs / getSpeedMultiplier(state);
}

function rollActionRewards(action: HackingAction) {
  const credits = rollCredits(action.rewards.credits);
  const data = action.rewards.data ? rollCredits(action.rewards.data) : 0;
  const xp = action.rewards.xp;
  return { credits, data, xp };
}

function completeCycle(action: HackingAction) {
  const state = useGameStore.getState();
  const rewards = rollActionRewards(action);
  const lootDrops = action.loot ? rollLoot(action.loot) : [];
  grantLoot(lootDrops);

  let newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      credits: state.resources.credits + rewards.credits,
      data: state.resources.data + rewards.data,
    },
  };
  const xpRes = gainSkillXpState(newState, 'hacking', rewards.xp);
  newState = xpRes.state;

  useGameStore.setState({
    ...newState,
    hackingState: {
      ...newState.hackingState,
      lastStartAt: Date.now(),
    },
  });

  const parts: string[] = [];
  if (rewards.credits) parts.push(`+${rewards.credits} Credits`);
  if (rewards.data) parts.push(`+${rewards.data} Data`);
  if (rewards.xp) parts.push(`+${rewards.xp} XP`);
  if (parts.length) showToast(parts.join(', '));

  if (useGameStore.getState().hackingState.isRunning) {
    scheduleNext(action);
  }
}

function scheduleNext(action: HackingAction) {
  const state = useGameStore.getState();
  const duration = getEffectiveDuration(action, state);
  hackingTimer = setTimeout(() => completeCycle(action), duration);
}

export function startHacking(actionId: string) {
  const action = getHackingAction(actionId);
  if (!action) return;
  const state = useGameStore.getState();
  if (state.skills.hacking.level < action.minLevel) {
    showToast(`Requires Hacking L${action.minLevel}`);
    return;
  }
  if (hackingTimer) {
    clearTimeout(hackingTimer);
    hackingTimer = null;
  }
  useGameStore.setState((s) => ({
    ...s,
    hackingState: {
      currentActionId: actionId,
      isRunning: true,
      lastStartAt: Date.now(),
    },
  }));
  scheduleNext(action);
}

export function stopHacking() {
  if (hackingTimer) {
    clearTimeout(hackingTimer);
    hackingTimer = null;
  }
  useGameStore.setState((s) => ({
    ...s,
    hackingState: { ...s.hackingState, isRunning: false },
  }));
}

export function getEffectiveDurationMs(actionId: string): number {
  const action = getHackingAction(actionId);
  if (!action) return 0;
  const state = useGameStore.getState();
  return getEffectiveDuration(action, state);
}
