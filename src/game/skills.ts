import { useGameStore } from './state/store';

export function getNextLevelXp(level: number): number {
  return 100 * level;
}

export function addCombatXp(amount: number) {
  if (amount <= 0) return;
  useGameStore.setState((s) => {
    let { level, xp } = s.skills.combat;
    const player = { ...s.player };
    xp += amount;
    while (xp >= getNextLevelXp(level)) {
      xp -= getNextLevelXp(level);
      level += 1;
      if (level % 2 === 0) player.hpMax += 5;
      if (level % 3 === 0) player.atk += 1;
    }
    return {
      ...s,
      player,
      skills: { ...s.skills, combat: { level, xp } },
    };
  });
}
