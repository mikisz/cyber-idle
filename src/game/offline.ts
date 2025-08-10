import { type GameState } from './state/store';
import { gainSkillXpState } from './skills';
import { getHackingAction } from '../data/hacking';
import { rollCredits, rollLoot, grantLoot } from './loot';

export const MAX_OFFLINE_MS = 12 * 60 * 60 * 1000;

export interface OfflineRewards {
  credits: number;
  data: number;
  xp: number;
}

function applyOfflineHacking(
  state: GameState,
  clampedMs: number,
): { state: GameState; rewards: OfflineRewards } {
  const hackingInfo = state.hackingState;
  if (!hackingInfo.currentActionId) {
    return { state, rewards: { credits: 0, data: 0, xp: 0 } };
  }
  const action = getHackingAction(hackingInfo.currentActionId);
  if (!action) {
    return { state, rewards: { credits: 0, data: 0, xp: 0 } };
  }
  const speed = state.hacking.timeMultiplier * state.bonuses.hackingSpeed;
  const effectiveDuration = action.baseDurationMs / speed;
  const completed = Math.floor(clampedMs / effectiveDuration);

  if (completed <= 0) {
    return { state, rewards: { credits: 0, data: 0, xp: 0 } };
  }

  let creditsTotal = 0;
  let dataTotal = 0;
  let xpTotal = 0;
  const lootDrops: string[] = [];
  for (let i = 0; i < completed; i++) {
    creditsTotal += rollCredits(action.rewards.credits);
    if (action.rewards.data)
      dataTotal += rollCredits(action.rewards.data);
    xpTotal += action.rewards.xp;
    if (action.loot) {
      lootDrops.push(...rollLoot(action.loot));
    }
  }

  grantLoot(lootDrops);

  let newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      credits: state.resources.credits + creditsTotal,
      data: state.resources.data + dataTotal,
    },
  };

  const xpResult = gainSkillXpState(newState, 'hacking', xpTotal);
  newState = xpResult.state;

  newState = {
    ...newState,
    hackingState: { ...newState.hackingState, isRunning: false },
  };

  return {
    state: newState,
    rewards: { credits: creditsTotal, data: dataTotal, xp: xpTotal },
  };
}

function applyOfflineExploration(
  state: GameState,
  _clampedMs: number,
): { state: GameState; rewards: OfflineRewards } {
  void _clampedMs;
  // TODO: implement exploration offline simulation
  return { state, rewards: { credits: 0, data: 0, xp: 0 } };
}

function applyOfflineCombat(
  state: GameState,
  _clampedMs: number,
): { state: GameState; rewards: OfflineRewards } {
  void _clampedMs;
  // TODO: implement combat offline simulation
  return { state, rewards: { credits: 0, data: 0, xp: 0 } };
}

export function applyOfflineProgress(
  state: GameState,
  deltaMs: number,
): { state: GameState; rewards: OfflineRewards } {
  const clamped = Math.min(deltaMs, MAX_OFFLINE_MS);
  let newState: GameState = { ...state };
  const rewards: OfflineRewards = { credits: 0, data: 0, xp: 0 };

  if (clamped < 60_000) {
    newState = {
      ...newState,
      hackingState: { ...newState.hackingState, isRunning: false },
    };
    return { state: newState, rewards };
  }

  if (state.hackingState.isRunning) {
    const res = applyOfflineHacking(newState, clamped);
    newState = res.state;
    rewards.credits += res.rewards.credits;
    rewards.data += res.rewards.data;
    rewards.xp += res.rewards.xp;
  }

  // Placeholder for future offline simulations
  // applyOfflineExploration and applyOfflineCombat currently return no rewards
  const explorationRes = applyOfflineExploration(newState, clamped);
  newState = explorationRes.state;
  rewards.credits += explorationRes.rewards.credits;
  rewards.data += explorationRes.rewards.data;
  rewards.xp += explorationRes.rewards.xp;

  const combatRes = applyOfflineCombat(newState, clamped);
  newState = combatRes.state;
  rewards.credits += combatRes.rewards.credits;
  rewards.data += combatRes.rewards.data;
  rewards.xp += combatRes.rewards.xp;

  newState = {
    ...newState,
    hackingState: { ...newState.hackingState, isRunning: false },
  };

  rewards.credits = Math.max(0, Math.floor(rewards.credits));
  rewards.data = Math.max(0, Math.floor(rewards.data));
  rewards.xp = Math.max(0, Math.floor(rewards.xp));

  return { state: newState, rewards };
}

