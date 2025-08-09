import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, initialState } from './state/store';
import { consumeItem } from './items';

describe('items', () => {
  beforeEach(() => {
    useGameStore.setState({
      ...initialState,
      inventory: ['medkit_small'],
      player: { ...initialState.player, hp: 10 },
    });
  });

  it('medkit heals and is removed', () => {
    const used = consumeItem('medkit_small');
    expect(used).toBe(true);
    const state = useGameStore.getState();
    expect(state.player.hp).toBe(50);
    expect(state.inventory).not.toContain('medkit_small');
  });
});
