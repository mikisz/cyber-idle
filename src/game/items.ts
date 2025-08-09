import { useGameStore, type GameState } from './state/store';
import { getItem, type Item } from '../data/items';

function applyItem(
  player: GameState['player'],
  hacking: GameState['hacking'],
  item: Item,
  op: 1 | -1
) {
  const newPlayer = { ...player };
  const newHacking = { ...hacking };
  if (item.stats?.atk) newPlayer.atk += op * item.stats.atk;
  if (item.stats?.hpMax) {
    newPlayer.hpMax += op * item.stats.hpMax;
    if (op > 0) {
      newPlayer.hp = Math.min(newPlayer.hp + item.stats.hpMax, newPlayer.hpMax);
    } else {
      newPlayer.hp = Math.min(newPlayer.hp, newPlayer.hpMax);
    }
  }
  if (item.stats?.hackingSpeed) {
    const mult = 1 + item.stats.hackingSpeed;
    newHacking.timeMultiplier =
      op > 0 ? newHacking.timeMultiplier * mult : newHacking.timeMultiplier / mult;
  }
  return { player: newPlayer, hacking: newHacking };
}

export function addItemToInventory(itemId: string) {
  const item = getItem(itemId);
  if (!item) return;
  useGameStore.setState((s) => ({ ...s, inventory: [...s.inventory, itemId] }));
}

export function equipItem(itemId: string) {
  const item = getItem(itemId);
  if (!item || item.type === 'consumable') return;
  useGameStore.setState((state) => {
    const inv = [...state.inventory];
    const idx = inv.indexOf(itemId);
    if (idx === -1) return state;
    inv.splice(idx, 1);
    const slot = item.type;
    const newEquipped = { ...state.equipped };
    let { player, hacking } = state;
    if (newEquipped[slot]) {
      const prevItem = getItem(newEquipped[slot]!);
      if (prevItem) {
        const res = applyItem(player, hacking, prevItem, -1);
        player = res.player;
        hacking = res.hacking;
        inv.push(prevItem.id);
      }
    }
    newEquipped[slot] = itemId;
    const res2 = applyItem(player, hacking, item, 1);
    player = res2.player;
    hacking = res2.hacking;
    if (player.hp > player.hpMax) player.hp = player.hpMax;
    return { ...state, inventory: inv, equipped: newEquipped, player, hacking };
  });
}

export function unequipItem(slot: 'weapon' | 'armor' | 'accessory') {
  useGameStore.setState((state) => {
    const itemId = state.equipped[slot];
    if (!itemId) return state;
    const item = getItem(itemId);
    const inv = [...state.inventory, itemId];
    const newEquipped = { ...state.equipped, [slot]: null };
    let { player, hacking } = state;
    if (item) {
      const res = applyItem(player, hacking, item, -1);
      player = res.player;
      hacking = res.hacking;
      if (player.hp > player.hpMax) player.hp = player.hpMax;
    }
    return { ...state, inventory: inv, equipped: newEquipped, player, hacking };
  });
}

export function consumeItem(itemId: string): boolean {
  const item = getItem(itemId);
  if (!item || item.type !== 'consumable') return false;
  let used = false;
  useGameStore.setState((state) => {
    const idx = state.inventory.indexOf(itemId);
    if (idx === -1) return state;
    const inv = [...state.inventory];
    inv.splice(idx, 1);
    const newPlayer = { ...state.player };
    if (itemId === 'medkit') {
      newPlayer.hp = Math.min(newPlayer.hp + 50, newPlayer.hpMax);
    }
    used = true;
    return { ...state, inventory: inv, player: newPlayer };
  });
  return used;
}
