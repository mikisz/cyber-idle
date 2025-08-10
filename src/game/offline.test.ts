import { describe, it, expect, beforeEach, afterEach, vi, type SpyInstance } from 'vitest';
import { applyOfflineProgress } from './offline';
import { initialState, type GameState } from './state/store';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return { ...JSON.parse(JSON.stringify(initialState)), ...overrides } as GameState;
}

describe('offline hacking progress', () => {
  let randSpy: SpyInstance;
  beforeEach(() => {
    randSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    randSpy.mockRestore();
  });

  it('grants rewards when hacking was running', () => {
    const state = makeState({
      hackingState: {
        currentActionId: 'street_terminals',
        isRunning: true,
        lastStartAt: 0,
      },
    });
    const res = applyOfflineProgress(state, 60_000);
    expect(res.rewards.credits).toBe(200);
    expect(res.rewards.data).toBe(10);
    expect(res.rewards.xp).toBe(50);
    expect(res.state.hackingState.isRunning).toBe(false);
  });

  it('grants nothing when hacking not running', () => {
    const state = makeState({
      hackingState: {
        currentActionId: 'street_terminals',
        isRunning: false,
        lastStartAt: 0,
      },
    });
    const res = applyOfflineProgress(state, 60_000);
    expect(res.rewards.credits).toBe(0);
    expect(res.rewards.data).toBe(0);
    expect(res.rewards.xp).toBe(0);
  });
});
