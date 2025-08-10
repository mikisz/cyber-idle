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
      resources: { ...s.resources, credits: 100 },
    }));
    const success = buyConsumable('medkit_s');
    expect(success).toBe(true);
    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(50);
    expect(state.inventory.medkit_s).toBe(1);
  });

  it('buying data-priced consumable costs data and adds to inventory', () => {
    useGameStore.setState((s) => ({
      ...s,
      resources: { ...s.resources, data: 30 },
    }));
    const success = buyConsumable('medkit_m');
    expect(success).toBe(true);
    const state = useGameStore.getState();
    expect(state.resources.data).toBe(5);
    expect(state.inventory.medkit_m).toBe(1);
  });

  it('buying upgrade marks owned and updates stats', () => {
    useGameStore.setState((s) => ({
      ...s,
      resources: { ...s.resources, credits: 200 },
    }));
    const success = buyUpgrade('tendo_servo_1');
    expect(success).toBe(true);
    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(50);
    expect(state.upgrades.owned.tendo_servo_1).toBe(true);
    expect(state.player.atk).toBe(initialState.player.atk + 2);
  });

  it('buying upgrade with data cost deducts data', () => {
    useGameStore.setState((s) => ({
      ...s,
      resources: { ...s.resources, credits: 200, data: 30 },
    }));
    const success = buyUpgrade('neuro_patch_1');
    expect(success).toBe(true);
    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(80);
    expect(state.resources.data).toBe(10);
    expect(state.upgrades.owned.neuro_patch_1).toBe(true);
  });
});
