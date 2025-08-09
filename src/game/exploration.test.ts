import { beforeEach, describe, expect, it, vi } from 'vitest';
import { explore, setLocation } from './exploration';
import { useGameStore, initialState } from './state/store';

describe('exploration', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
    setLocation('slums');
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
    setLocation('slums');
    const rand = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.99) // enemy roll -> loot path
      .mockReturnValueOnce(0) // scrap metal success
      .mockReturnValue(1); // fail remaining drops
    const result = explore();
    expect(result?.type).toBe('loot');
    const state = useGameStore.getState();
    expect(state.inventory.scrap_metal).toBe(1);
    rand.mockRestore();
  });
});
