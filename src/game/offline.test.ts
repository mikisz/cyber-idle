import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { applyOfflineProgress, MAX_OFFLINE_MS } from './offline';
import { initialState, GameState } from './state/store';

function makeState(overrides: Partial<GameState> = {}): GameState {
  const base: GameState = JSON.parse(JSON.stringify(initialState));
  return { ...base, ...overrides } as GameState;
}

describe('offline progress', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Delta > 12h still gives rewards only for 12h', () => {
    const state = makeState({ hacking: { ...initialState.hacking, inProgress: true } });
    const delta = MAX_OFFLINE_MS + 60 * 60 * 1000; // 13h
    const result = applyOfflineProgress(state, delta);
    // 12h / 10s = 4320 ticks, each gives 50 credits and 5 xp
    expect(result.rewards.credits).toBe(4320 * 50);
    expect(result.rewards.data).toBe(4320 * 1);
    expect(result.rewards.xp).toBe(4320 * 5);
    expect(result.state.hacking.inProgress).toBe(false);
  });

  it('Delta < 1 min gives no rewards', () => {
    const state = makeState({ hacking: { ...initialState.hacking, inProgress: true } });
    const result = applyOfflineProgress(state, 30 * 1000);
    expect(result.rewards.credits).toBe(0);
    expect(result.rewards.data).toBe(0);
    expect(result.rewards.xp).toBe(0);
    expect(result.state.resources.credits).toBe(0);
  });

  it('Handles no current hacking action', () => {
    const state = makeState();
    const result = applyOfflineProgress(state, 2 * 60 * 60 * 1000);
    expect(result.rewards.credits).toBe(0);
    expect(result.rewards.data).toBe(0);
    expect(result.rewards.xp).toBe(0);
  });

  it('Large delta is computed with constant time', () => {
    const state = makeState({ hacking: { ...initialState.hacking, inProgress: true } });
    const delta = 6 * 60 * 60 * 1000; // 6h
    applyOfflineProgress(state, delta);
    expect(Math.random).toHaveBeenCalledTimes(3);
  });
});
