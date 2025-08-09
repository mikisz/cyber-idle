import { create } from 'zustand';

export interface GameState {
  resources: { credits: number; data: number };
  player: {
    hpMax: number;
    hp: number;
    atk: number;
    def: number;
  };
  skills: {
    hacking: { level: number; xp: number };
    combat: { level: number; xp: number };
  };
  hacking: { timeMultiplier: number; inProgress: boolean };
  upgrades: { owned: Record<string, boolean> };
  inventory: Record<string, number>; // itemId -> quantity
  equipped: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
  };
  location: string | null;
  combat: {
    enemyId: string | null;
    enemyHp: number;
    inFight: boolean;
    log: string[];
  };
  meta: { lastSaveTimestamp: number | null };
}

export const initialState: GameState = {
  resources: { credits: 0, data: 0 },
  player: {
    hpMax: 50,
    hp: 50,
    atk: 5,
    def: 2,
  },
  skills: {
    hacking: { level: 1, xp: 0 },
    combat: { level: 1, xp: 0 },
  },
  hacking: { timeMultiplier: 1, inProgress: false },
  upgrades: { owned: {} },
  inventory: {},
  equipped: { weapon: null, armor: null, accessory: null },
  location: null,
  combat: { enemyId: null, enemyHp: 0, inFight: false, log: [] },
  meta: { lastSaveTimestamp: null },
};

export const useGameStore = create<GameState>(() => initialState);
