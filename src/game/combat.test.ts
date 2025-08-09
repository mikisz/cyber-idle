import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attack, calcDamage, startCombat } from './combat';
import { useGameStore, initialState } from './state/store';

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
      player: { ...initialState.player, atk: 50 },
    }));

    startCombat('thug');
    attack();

    const state = useGameStore.getState();
    expect(state.skills.combat.xp).toBe(12);
    expect(state.player.credits).toBeGreaterThan(0);
    expect(state.inventory).toContain('medkit');

    rand.mockRestore();
  });
});
