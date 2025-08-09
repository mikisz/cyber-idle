import { GameState } from './state/store';

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
  while (xp >= level * 100) {
    xp -= level * 100;
    level += 1;
  }

  const inv = { ...state.inventory };
  const drop = rollHackingLoot();
  if (drop) {
    inv[drop] = (inv[drop] ?? 0) + 1;
  }

  const newState: GameState = {
    ...state,
    player: { ...state.player, credits: state.player.credits + credits },
    skills: { ...state.skills, hacking: { level, xp } },
    inventory: inv,
  };

  return { state: newState, rewards: { credits, data: dataGain, xp: xpGain }, loot: drop };
}
