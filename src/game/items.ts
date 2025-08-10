import { useGameStore, type GameState } from './state/store';
import { getItem, type Item } from '../data/items';

function applyItem(player: GameState['player'], item: Item, op: 1 | -1) {
  const newPlayer = { ...player };
  if (item.stats?.atk) newPlayer.atk += op * item.stats.atk;
  if (item.stats?.def) newPlayer.def += op * item.stats.def;
  if (item.stats?.hpMax) {
    newPlayer.hpMax += op * item.stats.hpMax;
    newPlayer.hp = Math.min(newPlayer.hp, newPlayer.hpMax);
  }
  return newPlayer;
}

export function calculateBonuses(
  equipped: GameState['equipped'],
): GameState['bonuses'] {
  let damage = 0;
  let defense = 0;
  let hackingSpeed = 1;
  let exploration = 0;
  for (const slot of Object.keys(equipped) as (keyof typeof equipped)[]) {
    const id = equipped[slot];
    if (!id) continue;
    const item = getItem(id);
    if (!item?.stats) continue;
    if (item.stats.atk) damage += item.stats.atk;
    if (item.stats.def) defense += item.stats.def;
    if (item.stats.hackingSpeed) hackingSpeed *= item.stats.hackingSpeed;
    if (item.stats.explorationChance)
      exploration += item.stats.explorationChance;
  }
  return { damage, defense, hackingSpeed, exploration };
}

export function addItemToInventory(itemId: string, quantity = 1) {
  const item = getItem(itemId);
  if (!item) {
    console.warn(`Unknown item '${itemId}' - not added to inventory`);
    return;
  }
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
  if (!item || item.type === 'consumable' || item.type === 'misc') return;
  useGameStore.setState((state) => {
    const count = state.inventory[itemId] ?? 0;
    if (count <= 0) return state;
    const slot = item.type as 'weapon' | 'armor' | 'accessory';
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
    const bonuses = calculateBonuses(newEquipped);
    return {
      ...state,
      inventory: newInventory,
      equipped: newEquipped,
      player,
      bonuses,
    };
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
    const bonuses = calculateBonuses(newEquipped);
    return {
      ...state,
      inventory: newInventory,
      equipped: newEquipped,
      player,
      bonuses,
    };
  });
}

