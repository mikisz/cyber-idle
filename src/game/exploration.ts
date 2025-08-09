import { useGameStore } from './state/store';
import { getLocation } from '../data/locations';
import { getEnemyById } from '../data/enemies';
import { getItem } from '../data/items';
import { startCombat } from './combat';
import { gainSkillXpState } from './skills';
import { grantLoot, rollCredits, rollLoot, type LootEntry } from './loot';
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
    const table: LootEntry[] = loc.lootTable ?? [];
    const itemTable = table.filter((d) => d.itemId !== 'credits');
    const creditEntry = table.find((d) => d.itemId === 'credits');
    const drops = rollLoot(itemTable);
    if (drops.length > 0) {
      const first = drops[0];
      const qty = drops.filter((id) => id === first).length;
      const item = getItem(first);
      const summary = `Found ${qty > 1 ? `${qty}x ` : ''}${item?.name ?? first}`;
      let playerLeveled = false;
      useGameStore.setState((s) => {
        const xpRes = gainSkillXpState(s, 'exploration', 5);
        playerLeveled = xpRes.playerLeveled;
        return {
          ...xpRes.state,
          exploration: {
            ...xpRes.state.exploration,
            view: 'loot',
            lastEvent: { type: 'loot', summary, itemId: first },
            recentLog: trimLog([...xpRes.state.exploration.recentLog, summary]),
          },
        };
      });
      showToast('+5 Exploration XP');
      if (playerLeveled) {
        showToast(`Reached Level ${useGameStore.getState().playerLevel}`);
      }
      grantLoot(drops);
      return { type: 'loot', itemId: first, quantity: qty } as const;
    }
    if (creditEntry && Math.random() < creditEntry.chance) {
      const amount = rollCredits({
        min: creditEntry.min ?? 0,
        max: creditEntry.max ?? creditEntry.min ?? 0,
      });
      const summary = `Found ${amount} credits`;
      let playerLeveled = false;
      useGameStore.setState((s) => {
        const xpRes = gainSkillXpState(s, 'exploration', 5);
        playerLeveled = xpRes.playerLeveled;
        return {
          ...xpRes.state,
          resources: {
            ...xpRes.state.resources,
            credits: xpRes.state.resources.credits + amount,
          },
          exploration: {
            ...xpRes.state.exploration,
            view: 'loot',
            lastEvent: { type: 'loot', summary, credits: amount },
            recentLog: trimLog([...xpRes.state.exploration.recentLog, summary]),
          },
        };
      });
      showToast('+5 Exploration XP');
      if (playerLeveled) {
        showToast(`Reached Level ${useGameStore.getState().playerLevel}`);
      }
      return { type: 'credits', amount } as const;
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

