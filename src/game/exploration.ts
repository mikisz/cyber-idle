import { useGameStore } from './state/store';
import { getLocation } from '../data/locations';
import { getEnemyById } from '../data/enemies';
import { getItem } from '../data/items';
import { startCombat } from './combat';
import { addItemToInventory } from './items';
import { gainSkillXpState } from './skills';
import { showToast } from '../ui/Toast';

function trimLog(log: string[]) {
  return log.slice(-10);
}

export function setLocation(id: string) {
  useGameStore.setState((s) => ({
    ...s,
    exploration: {
      ...s.exploration,
      currentLocationId: id,
      view: 'location',
      recentLog: [],
    },
  }));
}

export function appendExplorationLog(line: string) {
  useGameStore.setState((s) => ({
    ...s,
    exploration: {
      ...s.exploration,
      recentLog: trimLog([...s.exploration.recentLog, line]),
    },
  }));
}

function rollLootTable(locationId: string) {
  const loc = getLocation(locationId);
  const items: { itemId: string; quantity: number }[] = [];
  let credits = 0;
  if (!loc?.lootTable) return { items, credits };
  for (const drop of loc.lootTable) {
    if (Math.random() < drop.chance) {
      const qty =
        drop.min !== undefined && drop.max !== undefined
          ? Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min
          : drop.min ?? 1;
      if (drop.itemId === 'credits') {
        credits += qty;
      } else {
        items.push({ itemId: drop.itemId, quantity: qty });
      }
    }
  }
  return { items, credits };
}

export function rollExplorationEvent(locationId: string) {
  const loc = getLocation(locationId);
  if (!loc) return null;
  const chances = loc.eventChances ?? { enemy: 0.99, loot: 0.01 };
  const roll = Math.random();
  if (roll < chances.enemy && loc.enemies.length) {
    const enemyId = loc.enemies[Math.floor(Math.random() * loc.enemies.length)];
    const enemy = getEnemyById(enemyId);
    startCombat(enemyId);
    let playerLeveled = false;
    useGameStore.setState((s) => {
      const xpRes = gainSkillXpState(s, 'exploration', 5);
      playerLeveled = xpRes.playerLeveled;
      return {
        ...xpRes.state,
        exploration: {
          ...xpRes.state.exploration,
          view: 'encounter',
          currentEnemyId: enemyId,
          recentLog: trimLog([
            ...xpRes.state.exploration.recentLog,
            `Encountered ${enemy?.name ?? enemyId}`,
          ]),
        },
      };
    });
    showToast('+5 Exploration XP');
    if (playerLeveled) {
      showToast(`Reached Level ${useGameStore.getState().playerLevel}`);
    }
    return { type: 'enemy', enemyId } as const;
  }
  if (roll < chances.enemy + chances.loot) {
    const loot = rollLootTable(locationId);
    if (loot.items.length > 0) {
      const drop = loot.items[0];
      addItemToInventory(drop.itemId, drop.quantity);
      const item = getItem(drop.itemId);
      const summary = `Found ${
        drop.quantity > 1 ? `${drop.quantity}x ` : ''
      }${item?.name ?? drop.itemId}`;
      let playerLeveled = false;
      useGameStore.setState((s) => {
        const xpRes = gainSkillXpState(s, 'exploration', 5);
        playerLeveled = xpRes.playerLeveled;
        return {
          ...xpRes.state,
          exploration: {
            ...xpRes.state.exploration,
            view: 'loot',
            lastEvent: { type: 'loot', summary, itemId: drop.itemId },
            recentLog: trimLog([...xpRes.state.exploration.recentLog, summary]),
          },
        };
      });
      showToast('+5 Exploration XP');
      if (playerLeveled) {
        showToast(`Reached Level ${useGameStore.getState().playerLevel}`);
      }
      return { type: 'loot', itemId: drop.itemId, quantity: drop.quantity } as const;
    }
    if (loot.credits > 0) {
      const summary = `Found ${loot.credits} credits`;
      let playerLeveled = false;
      useGameStore.setState((s) => {
        const xpRes = gainSkillXpState(s, 'exploration', 5);
        playerLeveled = xpRes.playerLeveled;
        return {
          ...xpRes.state,
          resources: {
            ...xpRes.state.resources,
            credits: xpRes.state.resources.credits + loot.credits,
          },
          exploration: {
            ...xpRes.state.exploration,
            view: 'loot',
            lastEvent: { type: 'loot', summary, credits: loot.credits },
            recentLog: trimLog([...xpRes.state.exploration.recentLog, summary]),
          },
        };
      });
      showToast('+5 Exploration XP');
      if (playerLeveled) {
        showToast(`Reached Level ${useGameStore.getState().playerLevel}`);
      }
      return { type: 'credits', amount: loot.credits } as const;
    }
  }
  let playerLeveled = false;
  useGameStore.setState((s) => {
    const xpRes = gainSkillXpState(s, 'exploration', 5);
    playerLeveled = xpRes.playerLeveled;
    return {
      ...xpRes.state,
      exploration: {
        ...xpRes.state.exploration,
        recentLog: trimLog([...xpRes.state.exploration.recentLog, 'Found nothing']),
      },
    };
  });
  showToast('+5 Exploration XP');
  if (playerLeveled) {
    showToast(`Reached Level ${useGameStore.getState().playerLevel}`);
  }
  return { type: 'nothing' } as const;
}

export function clearEncounter() {
  useGameStore.setState((s) => ({
    ...s,
    exploration: {
      ...s.exploration,
      currentEnemyId: null,
      view: 'location',
      lastEvent: undefined,
    },
  }));
}

