import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore, initialState } from './state/store';
import { buyConsumable, buyUpgrade } from './shop';

describe('shop actions', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
  });

  it('buying consumable costs credits and adds to inventory', () => {
    useGameStore.setState((s) => ({
      ...s,
      player: { ...s.player, credits: 100 },
    }));
    const success = buyConsumable('medkit_s');
    expect(success).toBe(true);
    const state = useGameStore.getState();
    expect(state.player.credits).toBe(50);
    expect(state.inventory.medkit_s).toBe(1);
  });

  it('buying upgrade marks owned and updates stats', () => {
    useGameStore.setState((s) => ({
      ...s,
      player: { ...s.player, credits: 200 },
    }));
    const success = buyUpgrade('tendo_servo_1');
    expect(success).toBe(true);
    const state = useGameStore.getState();
    expect(state.player.credits).toBe(50);
    expect(state.upgrades.owned.tendo_servo_1).toBe(true);
    expect(state.player.atk).toBe(initialState.player.atk + 2);
  });
});
