import { beforeEach, describe, expect, it } from 'vitest';
import { getEnemyXp } from '../data/enemies';
import { addCombatXp, getNextLevelXp } from './skills';
import { useGameStore, initialState } from './state/store';

describe('xp helpers', () => {
  it('getEnemyXp uses explicit value if present', () => {
    const enemy = { id: 't', name: 'Test', hp: 10, atk: 2, xp: 123 };
    expect(getEnemyXp(enemy)).toBe(123);
  });

  it('getEnemyXp falls back to formula', () => {
    const enemy = { id: 't2', name: 'Test2', hp: 10, atk: 2 };
    expect(getEnemyXp(enemy)).toBe(Math.round((10 + 2 * 5) * 0.6));
  });
});

describe('combat xp leveling', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
  });

  it('levels up and carries over excess xp', () => {
    const needed = getNextLevelXp(1);
    addCombatXp(needed + 20);
    const state = useGameStore.getState();
    expect(state.skills.combat.level).toBe(2);
    expect(state.skills.combat.xp).toBe(20);
  });
});
