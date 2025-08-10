import { useGameStore, type GameState, getDistrictById } from './state/store';
import type { DistrictAction } from '../data/world';
import { gainSkillXpState } from './skills';
import { rollCredits, rollLoot, grantLoot } from './loot';
import { showToast } from '../ui/Toast';
import { startCombat } from './combat';

let actionTimer: ReturnType<typeof setTimeout> | null = null;

function getEffectiveDuration(action: DistrictAction, state: GameState): number {
  if (action.kind === 'hacking') {
    const speed = state.hacking.timeMultiplier * state.bonuses.hackingSpeed;
    return action.baseDurationMs / speed;
  }
  return action.baseDurationMs;
}

function rollRewards(action: DistrictAction) {
  const credits = rollCredits(action.rewards.credits);
  const data = rollCredits(action.rewards.data);
  const xp = action.rewards.xp;
  return { credits, data, xp };
}

function completeCycle(action: DistrictAction) {
  const state = useGameStore.getState();
  const rewards = rollRewards(action);
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
  const xpRes = gainSkillXpState(newState, action.rewards.xpSkill, rewards.xp);
  newState = xpRes.state;

  useGameStore.setState({
    ...newState,
    districtRuntime: {
      ...newState.districtRuntime,
      startedAt: Date.now(),
    },
  });

  const parts: string[] = [];
  if (rewards.credits) parts.push(`+${rewards.credits} Credits`);
  if (rewards.data) parts.push(`+${rewards.data} Data`);
  if (rewards.xp) parts.push(`+${rewards.xp} XP`);
  if (parts.length) showToast(parts.join(', '));

  if (useGameStore.getState().districtRuntime.isRunning) {
    scheduleNext(action);
  }
}

function scheduleNext(action: DistrictAction) {
  const state = useGameStore.getState();
  const duration = getEffectiveDuration(action, state);
  if (actionTimer) {
    clearTimeout(actionTimer);
  }
  actionTimer = setTimeout(() => completeCycle(action), duration);
}

export function startDistrictAction(actionId: string) {
  const state = useGameStore.getState();
  const districtId = state.world.activeDistrictId;
  if (!districtId) return;
  const district = getDistrictById(districtId);
  const action = district?.actions.find((a) => a.id === actionId);
  if (!action) return;

  const skill = action.rewards.xpSkill;
  if (state.skills[skill].level < action.minLevel) {
    const skillName = skill.charAt(0).toUpperCase() + skill.slice(1);
    showToast(`Requires ${skillName} L${action.minLevel}`);
    return;
  }

  if (actionTimer) {
    clearTimeout(actionTimer);
    actionTimer = null;
  }

  useGameStore.setState((s) => ({
    ...s,
    districtRuntime: {
      runningActionId: actionId,
      startedAt: Date.now(),
      isRunning: true,
    },
  }));

  if (action.kind === 'combat') {
    // trigger simple combat if enemies defined
    const enemies = district?.enemies;
    if (enemies && enemies.length) {
      const enemyId = enemies[Math.floor(Math.random() * enemies.length)];
      startCombat(enemyId);
    }
  }

  scheduleNext(action);
}

export function stopDistrictAction() {
  if (actionTimer) {
    clearTimeout(actionTimer);
    actionTimer = null;
  }
  useGameStore.setState((s) => ({
    ...s,
    districtRuntime: { runningActionId: null, isRunning: false },
  }));
}

export function getDistrictActionDuration(action: DistrictAction, state: GameState) {
  return getEffectiveDuration(action, state);
}
