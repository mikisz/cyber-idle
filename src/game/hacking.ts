import { GameState } from './state/store';
import { getNextLevelXp } from './skills';

export const BASE_HACK_DURATION = 10000; // ms

export interface HackRewards {
  credits: number;
  data: number;
  xp: number;
}

function rollHackingLoot(): string | null {
  const roll = Math.random();
  if (roll < 0.01) return 'neural_chip';
  if (roll < 0.03) return 'shock_baton';
  return null;
}

export function performHack(state: GameState): {
  state: GameState;
  rewards: HackRewards;
  loot?: string | null;
} {
  const credits = 50 + Math.floor(Math.random() * 101);
  const xpGain = 5 + Math.floor(Math.random() * 11);
  const dataGain = 0;

  let { level, xp } = state.skills.hacking;
  xp += xpGain;
  while (xp >= getNextLevelXp(level)) {
    xp -= getNextLevelXp(level);
    level += 1;
  }

  const drop = rollHackingLoot();

  const newState: GameState = {
    ...state,
    resources: { ...state.resources, credits: state.resources.credits + credits },
    skills: { ...state.skills, hacking: { level, xp } },
  };

  return { state: newState, rewards: { credits, data: dataGain, xp: xpGain }, loot: drop };
}
