export type LootEntry = {
  itemId: string;
  chance: number;
  min?: number;
  max?: number;
};

export type CreditsDrop = { min: number; max: number };

import { addItemToInventory } from './items';
import { getItem } from '../data/items';

export function rollLoot(table: LootEntry[], rng: () => number = Math.random): string[] {
  const results: string[] = [];
  for (const drop of table) {
    if (rng() < drop.chance) {
      const qty =
        drop.min !== undefined && drop.max !== undefined
          ? Math.floor(rng() * (drop.max - drop.min + 1)) + drop.min
          : drop.min ?? 1;
      for (let i = 0; i < qty; i++) {
        results.push(drop.itemId);
      }
    }
  }
  return results;
}

export function rollCredits(drop?: CreditsDrop, rng: () => number = Math.random): number {
  if (!drop) return 0;
  const { min, max } = drop;
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function grantLoot(itemIds: string[]) {
  for (const id of itemIds) {
    const item = getItem(id);
    if (!item) {
      console.warn(`Unknown itemId: ${id}`);
      continue;
    }
    addItemToInventory(id, 1);
  }
}
