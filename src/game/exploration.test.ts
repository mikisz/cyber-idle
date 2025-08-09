import { beforeEach, describe, expect, it, vi } from 'vitest';
import { explore, setLocation } from './exploration';
import { useGameStore, initialState } from './state/store';
import { getItem } from '../data/items';

describe('exploration', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
    setLocation('dark_alley');
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
    setLocation('abandoned_warehouse');
    const rand = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.99) // enemy roll -> loot path
      .mockReturnValueOnce(0); // loot chance success
    const result = explore();
    expect(result?.type).toBe('loot');
    const state = useGameStore.getState();
    expect(state.inventory).toContain('knife_rusty');
    const item = getItem('knife_rusty');
    expect(item?.source).toBe('loot-only');
    rand.mockRestore();
  });
});
