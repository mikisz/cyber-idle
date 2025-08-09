import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, initialState } from './state/store';
import { consume } from './shop';

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
});
