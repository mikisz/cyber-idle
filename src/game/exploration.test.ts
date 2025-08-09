import { beforeEach, describe, expect, it, vi } from 'vitest';
import { explore, setLocation } from './exploration';
import { useGameStore, initialState } from './state/store';
import { getItem } from '../data/items';

describe('exploration', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
    setLocation('neon_street');
  });

  it('triggers enemy encounter', () => {
    const rand = vi.spyOn(Math, 'random').mockReturnValue(0);
    const result = explore();
    const state = useGameStore.getState();
    expect(result?.type).toBe('enemy');
    expect(state.combat.inFight).toBe(true);
    rand.mockRestore();
  });

  it('can find loot-only items', () => {
    const rand = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.995) // encounter roll -> loot
      .mockReturnValue(0.6); // item selection -> second item (small_credchip)
    const result = explore();
    expect(result?.type).toBe('loot');
    const state = useGameStore.getState();
    expect(state.player.credits).toBe(100); // small_credchip adds credits
    const item = getItem('small_credchip');
    expect(item?.source).toBe('loot-only');
    rand.mockRestore();
  });
});
