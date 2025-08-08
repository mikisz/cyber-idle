import { create } from 'zustand';

export interface GameState {
  player: { hp: number; credits: number; data: number };
  skills: {
    hacking: { level: number; xp: number };
    combat: { level: number; xp: number };
  };
  meta: { lastSavedAt: number | null };
}

export const initialState: GameState = {
  player: { hp: 100, credits: 0, data: 0 },
  skills: {
    hacking: { level: 1, xp: 0 },
    combat: { level: 1, xp: 0 },
  },
  meta: { lastSavedAt: null },
};

export const useGameStore = create<GameState>(() => initialState);
