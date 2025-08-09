import { GameState } from './state/store';
import { BASE_HACK_DURATION, performHack } from './hacking';
import { getItem } from '../data/items';

export const MAX_OFFLINE_MS = 12 * 60 * 60 * 1000;

export interface OfflineRewards {
  credits: number;
  data: number;
  xp: number;
}

export function applyOfflineProgress(
  state: GameState,
  deltaMs: number,
): { state: GameState; rewards: OfflineRewards } {
  const clamped = Math.min(deltaMs, MAX_OFFLINE_MS);
  let newState: GameState = {
    ...state,
    hacking: { ...state.hacking, inProgress: false },
  };
  const rewards: OfflineRewards = { credits: 0, data: 0, xp: 0 };

  if (clamped < 60_000) {
    return { state: newState, rewards };
  }

  if (state.hacking.inProgress) {
    const duration = BASE_HACK_DURATION / state.hacking.timeMultiplier;
    const ticks = Math.floor(clamped / duration);
    for (let i = 0; i < ticks; i++) {
      const result = performHack(newState);
      newState = result.state;
      if (result.loot) {
        if (getItem(result.loot)) {
          newState = {
            ...newState,
            inventory: {
              ...newState.inventory,
              [result.loot]: (newState.inventory[result.loot] ?? 0) + 1,
            },
          };
        } else {
          console.warn(`Unknown item '${result.loot}' - not added to inventory`);
        }
      }
      rewards.credits += result.rewards.credits;
      rewards.data += result.rewards.data;
      rewards.xp += result.rewards.xp;
    }
  }

  rewards.credits = Math.max(0, Math.floor(rewards.credits));
  rewards.data = Math.max(0, Math.floor(rewards.data));
  rewards.xp = Math.max(0, Math.floor(rewards.xp));

  return { state: newState, rewards };
}
