import { vi, describe, it, expect, beforeEach, afterEach, type SpyInstance } from 'vitest';
import { useGameStore, initialState } from './state/store';
import { startHacking, stopHacking } from './hacking';

describe('hacking loop', () => {
  let randSpy: SpyInstance;
  beforeEach(() => {
    useGameStore.setState(initialState);
    vi.useFakeTimers();
    randSpy = vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic min rewards
  });

  afterEach(() => {
    stopHacking();
    vi.useRealTimers();
    randSpy.mockRestore();
  });

  it('blocks actions below min level', () => {
    startHacking('corp_kiosks');
    const state = useGameStore.getState();
    expect(state.hackingState.isRunning).toBe(false);
    expect(state.hackingState.currentActionId).toBeNull();
  });

  it('grants rewards each cycle', () => {
    startHacking('street_terminals');
    vi.advanceTimersByTime(12000); // two cycles of 6000ms
    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(40);
    expect(state.resources.data).toBe(2);
    expect(state.skills.hacking.xp).toBe(10);
  });
});
