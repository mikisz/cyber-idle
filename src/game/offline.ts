import { type GameState } from './state/store';
import { gainSkillXpState } from './skills';
import { BASE_HACK_DURATION } from './hacking';

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
  const effectiveDuration = BASE_HACK_DURATION / state.hacking.timeMultiplier;
  const completed = Math.floor(clampedMs / effectiveDuration);

  if (completed <= 0) {
    return { state, rewards: { credits: 0, data: 0, xp: 0 } };
  }

  const creditsPer = 50 + Math.floor(Math.random() * 101);
  const xpPer = 5 + Math.floor(Math.random() * 11);
  const dataPer = 1 + Math.floor(Math.random() * 5);

  const rewards: OfflineRewards = {
    credits: creditsPer * completed,
    data: dataPer * completed,
    xp: xpPer * completed,
  };

  let newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      credits: state.resources.credits + rewards.credits,
      data: state.resources.data + rewards.data,
    },
  };

  const xpResult = gainSkillXpState(newState, 'hacking', rewards.xp);
  newState = xpResult.state;

  return { state: newState, rewards };
}

function applyOfflineExploration(
  state: GameState,
  _clampedMs: number,
): { state: GameState; rewards: OfflineRewards } {
  // TODO: implement exploration offline simulation
  return { state, rewards: { credits: 0, data: 0, xp: 0 } };
}

function applyOfflineCombat(
  state: GameState,
  _clampedMs: number,
): { state: GameState; rewards: OfflineRewards } {
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
      hacking: { ...newState.hacking, inProgress: false },
    };
    return { state: newState, rewards };
  }

  if (state.hacking.inProgress) {
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
    hacking: { ...newState.hacking, inProgress: false },
  };

  rewards.credits = Math.max(0, Math.floor(rewards.credits));
  rewards.data = Math.max(0, Math.floor(rewards.data));
  rewards.xp = Math.max(0, Math.floor(rewards.xp));

  return { state: newState, rewards };
}

