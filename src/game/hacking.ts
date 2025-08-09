import { GameState } from './state/store';
import { gainSkillXpState } from './skills';

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
  playerLeveled?: boolean;
} {
  const credits = 50 + Math.floor(Math.random() * 101);
  const xpGain = 5 + Math.floor(Math.random() * 11);
  const dataGain = 0;
  let newState: GameState = {
    ...state,
    resources: { ...state.resources, credits: state.resources.credits + credits },
  };
  const xpResult = gainSkillXpState(newState, 'hacking', xpGain);
  newState = xpResult.state;
  const drop = rollHackingLoot();

  return {
    state: newState,
    rewards: { credits, data: dataGain, xp: xpGain },
    loot: drop,
    playerLeveled: xpResult.playerLeveled,
  };
}
