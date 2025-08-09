import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore, initialState } from './state/store';
import { consume } from './shop';
import { addItemToInventory } from './items';

describe('items', () => {
  beforeEach(() => {
    useGameStore.setState({
      ...initialState,
      inventory: { medkit_s: 1 },
      player: { ...initialState.player, hp: 10 },
    });
  });

  it('medkit heals and is removed', () => {
    const used = consume('medkit_s');
    expect(used).toBe(true);
    const state = useGameStore.getState();
    expect(state.player.hp).toBe(50);
    expect(state.inventory.medkit_s).toBeUndefined();
  });

  it('skips and warns on unknown item', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    addItemToInventory('unknown_item');
    const state = useGameStore.getState();
    expect(state.inventory.unknown_item).toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
