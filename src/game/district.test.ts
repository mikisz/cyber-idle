import { describe, it, expect, beforeEach, afterEach, vi, type SpyInstance } from 'vitest';
import { useGameStore, initialState, setActiveDistrict, type GameState } from './state/store';
import { startDistrictAction, stopDistrictAction } from './district';
import { applyOfflineProgress } from './offline';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return { ...JSON.parse(JSON.stringify(initialState)), ...overrides } as GameState;
}

describe('district action loop', () => {
  let randSpy: SpyInstance;
  beforeEach(() => {
    useGameStore.setState(initialState);
    setActiveDistrict('neon_market');
    vi.useFakeTimers();
    randSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    stopDistrictAction();
    vi.useRealTimers();
    randSpy.mockRestore();
  });

  it('blocks actions below min level', () => {
    useGameStore.setState((s) => ({
      ...s,
      skills: { ...s.skills, exploration: { level: 0, xp: 0 } },
    }));
    startDistrictAction('market_scavenge');
    const state = useGameStore.getState();
    expect(state.districtRuntime.isRunning).toBe(false);
    expect(state.districtRuntime.runningActionId).toBeNull();
  });

  it('grants rewards each cycle', () => {
    startDistrictAction('market_scavenge');
    vi.advanceTimersByTime(10000); // two cycles of 5000ms
    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(2); // min roll 1 per cycle
    expect(state.skills.exploration.xp).toBe(10);
  });
});

describe('offline district progress', () => {
  let randSpy: SpyInstance;
  beforeEach(() => {
    randSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    randSpy.mockRestore();
  });

  it('grants rewards when action was running', () => {
    const state = makeState({
      world: { activeDistrictId: 'neon_market' },
      districtRuntime: { runningActionId: 'market_scavenge', isRunning: true, startedAt: 0 },
    });
    const res = applyOfflineProgress(state, 60_000);
    expect(res.rewards.credits).toBe(12); // 12 cycles *1
    expect(res.rewards.xp).toBe(60); // 12 cycles *5
    expect(res.state.districtRuntime.isRunning).toBe(false);
  });
});
