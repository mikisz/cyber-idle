import { GameState } from './state/store';
import { gainSkillXpState } from './skills';
import { grantLoot, rollLoot, type LootEntry } from './loot';

export const BASE_HACK_DURATION = 10000; // ms

export interface HackRewards {
  credits: number;
  data: number;
  xp: number;
}

const HACK_LOOT_TABLE: LootEntry[] = [
  { itemId: 'neural_chip', chance: 0.01 },
  { itemId: 'shock_baton', chance: 0.03 },
];

export function performHack(state: GameState): {
  state: GameState;
  rewards: HackRewards;
  loot?: string | null;
  playerLeveled?: boolean;
} {
  const credits = 50 + Math.floor(Math.random() * 101);
  const xpGain = 5 + Math.floor(Math.random() * 11);
  const dataGain = 1 + Math.floor(Math.random() * 5);
  let newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      credits: state.resources.credits + credits,
      data: state.resources.data + dataGain,
    },
  };
  const xpResult = gainSkillXpState(newState, 'hacking', xpGain);
  newState = xpResult.state;
  const drops = rollLoot(HACK_LOOT_TABLE);
  grantLoot(drops);

  return {
    state: newState,
    rewards: { credits, data: dataGain, xp: xpGain },
    loot: drops[0] ?? null,
    playerLeveled: xpResult.playerLeveled,
  };
}
