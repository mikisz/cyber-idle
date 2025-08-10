import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useGameStore, initialState } from '../../game/state/store';
import HackingTab from './HackingTab';

describe('HackingTab', () => {
  beforeEach(() => {
    useGameStore.setState(initialState); // reset store
  });

  it('rewards credits, xp and loot after hacking completes', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic rewards

    render(<HackingTab />);
    fireEvent.click(screen.getByRole('button', { name: /start hack/i }));

    act(() => {
      vi.runAllTimers();
    });

    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(50);
    expect(state.resources.data).toBe(1);
    expect(state.skills.hacking.xp).toBe(5);
    expect(state.inventory.neural_chip).toBe(1);

    vi.useRealTimers();
  });

  it('levels up when xp threshold reached', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // credits 100, xp 10
    useGameStore.setState((s) => ({
      ...s,
      skills: { ...s.skills, hacking: { level: 1, xp: 95 } },
    }));

    render(<HackingTab />);
    fireEvent.click(screen.getByRole('button', { name: /start hack/i }));

    act(() => {
      vi.runAllTimers();
    });

    const state = useGameStore.getState();
    expect(state.resources.credits).toBe(100);
    expect(state.resources.data).toBe(3);
    expect(state.skills.hacking.level).toBe(2);
    expect(state.skills.hacking.xp).toBe(5);

    vi.useRealTimers();
  });
});
