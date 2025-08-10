import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore, initialState } from './state/store';
import { buyItem, buyUpgrade } from './shop';
import { sellItem } from './items';

describe('shop actions', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
  });

  it('buying item costs credits and adds to inventory', () => {
    useGameStore.setState((s) => ({
      ...s,
      resources: { ...s.resources, credits: 100 },
    }));
    const success = buyItem('medkit_s');
    expect(success).toBe(true);
    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(50);
    expect(state.inventory.medkit_s).toBe(1);
  });

  it('selling item grants credits and removes it from inventory', () => {
    useGameStore.setState((s) => ({
      ...s,
      inventory: { medkit_s: 1 },
      resources: { ...s.resources, credits: 0 },
    }));
    const success = sellItem('medkit_s');
    expect(success).toBe(true);
    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(50);
    expect(state.inventory.medkit_s).toBeUndefined();
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
