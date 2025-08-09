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
  if (roll < loc.encounterRates.enemy) {
    const enemyId = loc.enemies[Math.floor(Math.random() * loc.enemies.length)];
    startCombat(enemyId);
    return { type: 'enemy', enemyId } as const;
  }
  if (roll < loc.encounterRates.enemy + loc.encounterRates.loot) {
    const itemId = loc.loot[Math.floor(Math.random() * loc.loot.length)];
    addItemToInventory(itemId);
    return { type: 'loot', itemId } as const;
  }
  return { type: 'nothing' } as const;
}
