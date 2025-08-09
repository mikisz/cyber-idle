import { GameState } from './state/store';

export const BASE_HACK_DURATION = 10000; // ms

export interface HackRewards {
  credits: number;
  data: number;
  xp: number;
}

export function performHack(state: GameState): {
  state: GameState;
  rewards: HackRewards;
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

  const newState: GameState = {
    ...state,
    player: { ...state.player, credits: state.player.credits + credits },
    skills: { ...state.skills, hacking: { level, xp } },
  };

  return { state: newState, rewards: { credits, data: dataGain, xp: xpGain } };
}
