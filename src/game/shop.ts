import { useGameStore } from './state/store';
import { getItem } from '../data/items';
import { getUpgrade } from '../data/upgrades';

export function buyConsumable(itemId: string): boolean {
  const item = getItem(itemId);
  if (!item || item.type !== 'consumable') return false;
  if (item.source === 'loot-only') return false;
  const price = item.buyPriceCredits ?? 0;
  let success = false;
  useGameStore.setState((state) => {
    if (state.player.credits < price) return state;
    success = true;
    return {
      ...state,
      player: { ...state.player, credits: state.player.credits - price },
      inventory: {
        ...state.inventory,
        [itemId]: (state.inventory[itemId] ?? 0) + 1,
      },
    };
  });
  return success;
}

export function buyUpgrade(upgradeId: string): boolean {
  const upgrade = getUpgrade(upgradeId);
  if (!upgrade) return false;
  let success = false;
  useGameStore.setState((state) => {
    if (state.upgrades.owned[upgradeId]) return state;
    if (state.player.credits < upgrade.costCredits) return state;
    success = true;
    const owned = { ...state.upgrades.owned, [upgradeId]: true };
    const player = { ...state.player, credits: state.player.credits - upgrade.costCredits };
    if (upgrade.effects.atk) player.atk += upgrade.effects.atk;
    if (upgrade.effects.hpMax) {
      player.hpMax += upgrade.effects.hpMax;
      player.hp = player.hpMax;
    }
    let timeMultiplier = 1;
    for (const id of Object.keys(owned)) {
      const u = getUpgrade(id);
      if (u?.effects.hackingSpeed) timeMultiplier *= u.effects.hackingSpeed;
    }
    return {
      ...state,
      player,
      hacking: { ...state.hacking, timeMultiplier },
      upgrades: { owned },
    };
  });
  return success;
}

export function consume(itemId: string): boolean {
  const item = getItem(itemId);
  if (!item || item.type !== 'consumable') return false;
  let used = false;
  useGameStore.setState((state) => {
    const count = state.inventory[itemId] ?? 0;
    if (count <= 0) return state;
    used = true;
    const newInventory = { ...state.inventory, [itemId]: count - 1 };
    if (newInventory[itemId] <= 0) delete newInventory[itemId];
    const player = { ...state.player };
    if (item.effect?.heal) {
      player.hp = Math.min(player.hp + item.effect.heal, player.hpMax);
    }
    return { ...state, inventory: newInventory, player };
  });
  return used;
}
