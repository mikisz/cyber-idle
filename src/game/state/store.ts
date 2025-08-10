import { create } from 'zustand';

export interface GameState {
  resources: { credits: number; data: number };
  player: {
    hpMax: number;
    hp: number;
    atk: number;
    def: number;
  };
  playerLevel: number;
  playerXP: number;
  playerXPToNextLevel: number;
  skills: {
    hacking: { level: number; xp: number };
    combat: { level: number; xp: number };
    exploration: { level: number; xp: number };
  };
  hacking: { timeMultiplier: number; inProgress: boolean };
  upgrades: { owned: Record<string, boolean> };
  inventory: Record<string, number>; // itemId -> quantity
  equipped: {
    weapon: string | null;
    armor: string | null;
    upgrade: string | null;
  };
  bonuses: {
    damage: number;
    defense: number;
    hackingSpeed: number;
    exploration: number;
  };
  combat: {
    enemyId: string | null;
    enemyHp: number;
    inFight: boolean;
    log: string[];
  };
  exploration: {
    currentLocationId: string | null;
    view: 'select' | 'location' | 'encounter' | 'loot';
    currentEnemyId: string | null;
    lastEvent?: {
      type: 'loot' | 'enemy';
      summary: string;
      itemId?: string;
      credits?: number;
    };
    recentLog: string[];
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
  playerLevel: 1,
  playerXP: 0,
  playerXPToNextLevel: 100,
  skills: {
    hacking: { level: 1, xp: 0 },
    combat: { level: 1, xp: 0 },
    exploration: { level: 1, xp: 0 },
  },
  hacking: { timeMultiplier: 1, inProgress: false },
  upgrades: { owned: {} },
  inventory: {},
  equipped: { weapon: null, armor: null, upgrade: null },
  bonuses: { damage: 0, defense: 0, hackingSpeed: 1, exploration: 0 },
  combat: { enemyId: null, enemyHp: 0, inFight: false, log: [] },
  exploration: {
    currentLocationId: null,
    view: 'select',
    currentEnemyId: null,
    recentLog: [],
  },
  meta: { lastSaveTimestamp: null },
};

export const useGameStore = create<GameState>(() => initialState);
