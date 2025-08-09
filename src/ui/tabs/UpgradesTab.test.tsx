import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import UpgradesTab from './UpgradesTab';
import HackingTab from './HackingTab';
import { useGameStore, initialState } from '../../game/state/store';

describe('Upgrades', () => {
  beforeEach(() => {
    useGameStore.setState(initialState);
  });

  it('buying hack_speed_1 reduces hack duration', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    useGameStore.setState((s) => ({
      ...s,
      player: { ...s.player, credits: 100, data: 100 },
    }));

    render(<UpgradesTab />);
    fireEvent.click(screen.getByTestId('buy-hack_speed_1'));

    render(<HackingTab />);
    fireEvent.click(screen.getByRole('button', { name: /start hack/i }));

    act(() => {
      vi.advanceTimersByTime(9500);
    });
    expect(useGameStore.getState().player.credits).toBe(50);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(useGameStore.getState().player.credits).toBe(100);

    vi.useRealTimers();
  });

  it('buying atk_1 increases atk by 1', () => {
    useGameStore.setState((s) => ({
      ...s,
      player: { ...s.player, credits: 100 },
    }));

    render(<UpgradesTab />);
    fireEvent.click(screen.getByTestId('buy-atk_1'));
    expect(useGameStore.getState().player.atk).toBe(6);
  });

  it('buying hp_1 increases hpMax by 10 and heals to full', () => {
    useGameStore.setState((s) => ({
      ...s,
      player: { ...s.player, credits: 100, hp: 10 },
    }));

    render(<UpgradesTab />);
    fireEvent.click(screen.getByTestId('buy-hp_1'));
    const state = useGameStore.getState();
    expect(state.player.hpMax).toBe(60);
    expect(state.player.hp).toBe(60);
  });
});
