import { useGameStore, type GameState } from './state/store';
import { showToast } from '../ui/Toast';

export const XP_BASE = 100;
export const XP_MULTIPLIER = 1.1;

export function getNextLevelXp(level: number): number {
  return Math.round(XP_BASE * Math.pow(XP_MULTIPLIER, level - 1));
}

export function gainSkillXpState(
  state: GameState,
  skill: keyof GameState['skills'],
  amount: number,
): { state: GameState; playerLeveled: boolean } {
  if (amount <= 0) return { state, playerLeveled: false };
  const skills = { ...state.skills };
  let { level, xp } = skills[skill];
  xp += amount;
  while (xp >= getNextLevelXp(level)) {
    xp -= getNextLevelXp(level);
    level += 1;
  }
  skills[skill] = { level, xp };

  let playerLevel = state.playerLevel;
  let playerXP = state.playerXP + amount;
  let playerLeveled = false;
  while (playerXP >= getNextLevelXp(playerLevel)) {
    playerXP -= getNextLevelXp(playerLevel);
    playerLevel += 1;
    playerLeveled = true;
  }
  const playerXPToNextLevel = getNextLevelXp(playerLevel);
  const newState: GameState = {
    ...state,
    skills,
    playerLevel,
    playerXP,
    playerXPToNextLevel,
  };
  if (playerLeveled) {
    newState.resources = {
      ...state.resources,
      credits: state.resources.credits + 10,
    };
  }
  return { state: newState, playerLeveled };
}

export function addSkillXp(
  skill: keyof GameState['skills'],
  amount: number,
) {
  let playerLeveled = false;
  useGameStore.setState((s) => {
    const res = gainSkillXpState(s, skill, amount);
    playerLeveled = res.playerLeveled;
    return res.state;
  });
  if (playerLeveled) {
    showToast(`Reached Level ${useGameStore.getState().playerLevel}`);
  }
}

export function addCombatXp(amount: number) {
  addSkillXp('combat', amount);
}

export function getXPProgress(): number {
  const { playerXP, playerXPToNextLevel } = useGameStore.getState();
  return (playerXP / playerXPToNextLevel) * 100;
}
