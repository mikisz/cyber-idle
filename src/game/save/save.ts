import { GameState } from '../state/store';

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
      resolve(data ? data.state : null);
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
