import { create } from 'zustand';

export interface GameState {
  player: {
    hpMax: number;
    hp: number;
    atk: number;
    def: number;
    credits: number;
    data: number;
  };
  skills: {
    hacking: { level: number; xp: number };
    combat: { level: number; xp: number };
  };
  hacking: { timeMultiplier: number };
  upgrades: { owned: Record<string, boolean> };
  inventory: { [itemId: string]: number };
  combat: {
    enemyId: string | null;
    enemyHp: number;
    inFight: boolean;
    log: string[];
  };
  meta: { lastSavedAt: number | null };
}

export const initialState: GameState = {
  player: {
    hpMax: 50,
    hp: 50,
    atk: 5,
    def: 2,
    credits: 0,
    data: 0,
  },
  skills: {
    hacking: { level: 1, xp: 0 },
    combat: { level: 1, xp: 0 },
  },
  hacking: { timeMultiplier: 1 },
  upgrades: { owned: {} },
  inventory: {},
  combat: { enemyId: null, enemyHp: 0, inFight: false, log: [] },
  meta: { lastSavedAt: null },
};

export const useGameStore = create<GameState>(() => initialState);
