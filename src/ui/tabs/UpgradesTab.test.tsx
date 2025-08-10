import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import UpgradesTab from './UpgradesTab';
import HackingTab from './HackingTab';
import { useGameStore, initialState } from '../../game/state/store';

describe('Upgrades', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
  });

  it('buying neuro_patch_1 reduces hack duration', () => {
    vi.useFakeTimers();
    const rand = vi.spyOn(Math, 'random').mockReturnValue(0);

    useGameStore.setState((s) => ({
      ...s,
      resources: { ...s.resources, credits: 200, data: 25 },
    }));

    render(<UpgradesTab />);
    fireEvent.click(screen.getByTestId('buy-neuro_patch_1'));
    expect(useGameStore.getState().resources.data).toBe(5);

    render(<HackingTab />);
    fireEvent.click(screen.getByRole('button', { name: /start hack/i }));

    act(() => {
      vi.advanceTimersByTime(9500);
    });
    expect(useGameStore.getState().resources.credits).toBe(80);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    const finalState = useGameStore.getState();
    expect(finalState.resources.credits).toBe(130);
    expect(finalState.resources.data).toBe(6);

    rand.mockRestore();
    vi.useRealTimers();
  });

  it('buying tendo_servo_1 increases atk by 2', () => {
    useGameStore.setState((s) => ({
      ...s,
      resources: { ...s.resources, credits: 200 },
    }));

    render(<UpgradesTab />);
    fireEvent.click(screen.getByTestId('buy-tendo_servo_1'));
    expect(useGameStore.getState().player.atk).toBe(7);
  });

  it('buying subdermal_armor_1 increases hpMax by 15 and heals to full', () => {
    useGameStore.setState((s) => ({
      ...s,
      resources: { ...s.resources, credits: 200 },
      player: { ...s.player, hp: 10 },
    }));

    render(<UpgradesTab />);
    fireEvent.click(screen.getByTestId('buy-subdermal_armor_1'));
    const state = useGameStore.getState();
    expect(state.player.hpMax).toBe(65);
    expect(state.player.hp).toBe(65);
  });

  it('disables purchase when lacking data', () => {
    useGameStore.setState((s) => ({
      ...s,
      resources: { ...s.resources, credits: 200, data: 5 },
    }));
    render(<UpgradesTab />);
    expect(screen.getByTestId('buy-neuro_patch_1')).toBeDisabled();
  });
});
