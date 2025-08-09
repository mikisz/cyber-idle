import { useGameStore, type GameState } from './state/store';
import { getItem, type Item } from '../data/items';

function applyItem(player: GameState['player'], item: Item, op: 1 | -1) {
  const newPlayer = { ...player };
  if (item.stats?.attack) newPlayer.atk += op * item.stats.attack;
  if (item.stats?.defense) newPlayer.def += op * item.stats.defense;
  return newPlayer;
}

export function addItemToInventory(itemId: string, quantity = 1) {
  const item = getItem(itemId);
  if (!item) return;
  useGameStore.setState((s) => ({
    ...s,
    inventory: {
      ...s.inventory,
      [itemId]: (s.inventory[itemId] ?? 0) + quantity,
    },
  }));
}

export function equipItem(itemId: string) {
  const item = getItem(itemId);
  if (!item || item.type === 'consumable' || item.type === 'quest' || item.type === 'misc')
    return;
  useGameStore.setState((state) => {
    const count = state.inventory[itemId] ?? 0;
    if (count <= 0) return state;
    const slot = item.type as 'weapon' | 'armor';
    const newInventory = { ...state.inventory, [itemId]: count - 1 };
    if (newInventory[itemId] <= 0) delete newInventory[itemId];
    const newEquipped = { ...state.equipped };
    let player = { ...state.player };
    if (newEquipped[slot]) {
      const prevItem = getItem(newEquipped[slot]!);
      if (prevItem) {
        player = applyItem(player, prevItem, -1);
        newInventory[prevItem.id] = (newInventory[prevItem.id] ?? 0) + 1;
      }
    }
    newEquipped[slot] = itemId;
    player = applyItem(player, item, 1);
    return { ...state, inventory: newInventory, equipped: newEquipped, player };
  });
}

export function unequipItem(slot: 'weapon' | 'armor' | 'accessory') {
  useGameStore.setState((state) => {
    const itemId = state.equipped[slot];
    if (!itemId) return state;
    const item = getItem(itemId);
    const newInventory = {
      ...state.inventory,
      [itemId]: (state.inventory[itemId] ?? 0) + 1,
    };
    const newEquipped = { ...state.equipped, [slot]: null };
    let player = { ...state.player };
    if (item) {
      player = applyItem(player, item, -1);
    }
    return { ...state, inventory: newInventory, equipped: newEquipped, player };
  });
}

export function consumeItem(itemId: string): boolean {
  const item = getItem(itemId);
  if (!item || item.type !== 'consumable') return false;
  let used = false;
  useGameStore.setState((state) => {
    const count = state.inventory[itemId] ?? 0;
    if (count <= 0) return state;
    const newInventory = { ...state.inventory, [itemId]: count - 1 };
    if (newInventory[itemId] <= 0) delete newInventory[itemId];
    const newPlayer = { ...state.player };
    if (item.stats?.heal) {
      newPlayer.hp = Math.min(newPlayer.hp + item.stats.heal, newPlayer.hpMax);
    }
    used = true;
    return { ...state, inventory: newInventory, player: newPlayer };
  });
  return used;
}

