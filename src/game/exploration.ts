import { useGameStore } from './state/store';
import { getLocation } from '../data/locations';
import { startCombat } from './combat';
import { addItemToInventory } from './items';

export function setLocation(locationId: string) {
  useGameStore.setState((s) => ({ ...s, location: locationId }));
}

export function explore() {
  const state = useGameStore.getState();
  if (!state.location) return null;
  const loc = getLocation(state.location);
  if (!loc) return null;
  const roll = Math.random();
  if (loc.enemies.length && roll < 0.8) {
    const enemyId = loc.enemies[Math.floor(Math.random() * loc.enemies.length)];
    startCombat(enemyId);
    return { type: 'enemy', enemyId } as const;
  }
  if (loc.loot) {
    for (const entry of loc.loot) {
      if (Math.random() < entry.chance) {
        addItemToInventory(entry.itemId);
        return { type: 'loot', itemId: entry.itemId } as const;
      }
    }
  }
  return { type: 'nothing' } as const;
}
