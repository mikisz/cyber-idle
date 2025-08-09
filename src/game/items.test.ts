import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, initialState } from './state/store';
import { consumeItem } from './items';

describe('items', () => {
  beforeEach(() => {
    useGameStore.setState({
      ...initialState,
      inventory: { medkit: 1 },
      player: { ...initialState.player, hp: 10 },
    });
  });

  it('medkit heals and is removed', () => {
    const used = consumeItem('medkit');
    expect(used).toBe(true);
    const state = useGameStore.getState();
    expect(state.player.hp).toBe(50);
    expect(state.inventory.medkit).toBeUndefined();
  });
});
