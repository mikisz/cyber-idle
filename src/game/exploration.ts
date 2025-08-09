import { useGameStore } from './state/store';
import { getLocation } from '../data/locations';
import { startCombat } from './combat';
import { addItemToInventory } from './items';
import { rollLoot } from '../data/lootTables';

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
  const loot = rollLoot(loc.id);
  if (loot.items.length > 0) {
    const drop = loot.items[0];
    addItemToInventory(drop.itemId, drop.quantity);
    return { type: 'loot', itemId: drop.itemId } as const;
  }
  if (loot.credits > 0) {
    useGameStore.setState((s) => ({
      ...s,
      player: { ...s.player, credits: s.player.credits + loot.credits },
    }));
    return { type: 'credits', amount: loot.credits } as const;
  }
  return { type: 'nothing' } as const;
}
