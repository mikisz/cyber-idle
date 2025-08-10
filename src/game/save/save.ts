import { GameState, initialState } from '../state/store';
import { getNextLevelXp } from '../skills';
import { calculateBonuses } from '../items';

const DB_NAME = 'cyber-idle';
const STORE_NAME = 'game';
const SAVE_KEY = 'state';
const SAVE_VERSION = 1;

interface PersistedData {
  version: number;
  state: GameState;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadGame(): Promise<GameState | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(SAVE_KEY);
    req.onsuccess = () => {
      const data = req.result as PersistedData | undefined;
      if (!data) {
        resolve(null);
        return;
      }
      const s = data.state as GameState;
      const merged: GameState = {
        ...initialState,
        ...s,
        player: { ...initialState.player, ...s.player },
        skills: { ...initialState.skills, ...s.skills },
        hacking: { ...initialState.hacking, ...s.hacking },
        hackingState: { ...initialState.hackingState, ...s.hackingState },
        upgrades: { ...initialState.upgrades, ...s.upgrades },
        inventory: { ...initialState.inventory, ...s.inventory },
        equipped: { ...initialState.equipped, ...s.equipped },
        bonuses: s.bonuses ?? calculateBonuses(s.equipped ?? initialState.equipped),
        combat: { ...initialState.combat, ...s.combat },
        exploration: { ...initialState.exploration, ...s.exploration },
        meta: { ...initialState.meta, ...s.meta },
      };
      if (typeof merged.playerLevel !== 'number') merged.playerLevel = 1;
      if (typeof merged.playerXP !== 'number') merged.playerXP = 0;
      merged.playerXPToNextLevel =
        typeof s.playerXPToNextLevel === 'number'
          ? s.playerXPToNextLevel
          : getNextLevelXp(merged.playerLevel);
      if (!merged.skills.exploration)
        merged.skills.exploration = { level: 1, xp: 0 };
      resolve(merged);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveGame(state: GameState): Promise<GameState> {
  const db = await openDatabase();
  const withTimestamp: GameState = {
    ...state,
    meta: { ...state.meta, lastSaveTimestamp: Date.now() },
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx
      .objectStore(STORE_NAME)
      .put({ version: SAVE_VERSION, state: withTimestamp }, SAVE_KEY);
    req.onsuccess = () => resolve(withTimestamp);
    req.onerror = () => reject(req.error);
  });
}

export async function exportGame(): Promise<string> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(SAVE_KEY);
    req.onsuccess = () => {
      const data = req.result as PersistedData | undefined;
      resolve(JSON.stringify(data ?? { version: SAVE_VERSION, state: null }));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function importGame(json: string): Promise<GameState> {
  const data = JSON.parse(json) as PersistedData;
  if (!data || typeof data.version !== 'number' || !data.state) {
    throw new Error('Invalid save data');
  }
  await saveGame(data.state);
  return data.state;
}

export async function clearGame(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).delete(SAVE_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
