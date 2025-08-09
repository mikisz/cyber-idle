import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attack, calcDamage, startCombat, flee } from './combat';
import { useGameStore, initialState } from './state/store';
import { getEnemyById, getEnemyXp } from '../data/enemies';

describe('combat system', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
  });

  it('damage formula returns at least 1', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5); // variance 0
    const dmg = calcDamage(1, 100);
    expect(dmg).toBeGreaterThanOrEqual(1);
    spy.mockRestore();
  });

  it('winning a fight grants rewards', () => {
    const rand = vi.spyOn(Math, 'random').mockReturnValue(0);

    useGameStore.setState(() => ({
      ...initialState,
      player: { ...initialState.player, atk: 100 },
      location: 'slums',
    }));

    startCombat('street_thug');
    attack();

    const state = useGameStore.getState();
    const enemy = getEnemyById('street_thug')!;
    expect(state.skills.combat.xp).toBe(getEnemyXp(enemy));
    expect(state.resources.credits).toBe(5);
    expect(state.inventory.scrap_metal).toBe(1);

    rand.mockRestore();
  });

  it('flee can fail and cause damage', () => {
    // first random is for flee check (0.8 -> fail)
    // second random for damage variance (0.5 -> 0)
    const rand = vi.spyOn(Math, 'random').mockReturnValueOnce(0.8).mockReturnValue(0.5);
    useGameStore.setState(() => ({
      ...initialState,
      player: { ...initialState.player, hp: 20 },
    }));
    startCombat('street_thug');
    flee();
    const state = useGameStore.getState();
    expect(state.player.hp).toBeLessThan(20);
    expect(state.combat.inFight).toBe(true);
    rand.mockRestore();
  });

  it('defeat loses credits and restores health', () => {
    const rand = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    useGameStore.setState(() => ({
      ...initialState,
      player: { ...initialState.player, hp: 1 },
      resources: { ...initialState.resources, credits: 100 },
    }));
    startCombat('street_thug');
    attack();
    const state = useGameStore.getState();
    expect(state.player.hp).toBe(state.player.hpMax);
    expect(state.resources.credits).toBe(90);
    expect(state.location).toBeNull();
    rand.mockRestore();
  });
});
