import { useGameStore } from './state/store';
import enemiesData from '../data/enemies.json';

export type Enemy = (typeof enemiesData)[number];

export const enemies: Enemy[] = enemiesData;

export function getEnemy(id: string): Enemy | undefined {
  return enemies.find((e) => e.id === id);
}

function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calcDamage(atk: number, def: number): number {
  const variance = randRange(-1, 1);
  return Math.max(1, atk + variance - def);
}

function trimLog(log: string[]): string[] {
  return log.slice(-10);
}

export function startCombat(enemyId: string) {
  const enemy = getEnemy(enemyId);
  if (!enemy) return;
  useGameStore.setState((s) => ({
    ...s,
    combat: {
      enemyId,
      enemyHp: enemy.hp,
      inFight: true,
      log: [`Engaged ${enemy.name}`],
    },
  }));
}

function rollLoot(enemy: Enemy) {
  let credits = 0;
  const items: Record<string, number> = {};
  for (const entry of enemy.loot) {
    if (entry.credits) {
      credits += randRange(entry.min, entry.max);
    } else if (entry.itemId) {
      if (Math.random() < (entry.chance ?? 1)) {
        const qty = randRange(entry.min, entry.max);
        items[entry.itemId] = (items[entry.itemId] ?? 0) + qty;
      }
    }
  }
  return { credits, items };
}

function awardVictory(enemy: Enemy, log: string[]) {
  useGameStore.setState((state) => {
    const rewards = rollLoot(enemy);
    const inv = { ...state.inventory };
    for (const [itemId, qty] of Object.entries(rewards.items)) {
      inv[itemId] = (inv[itemId] ?? 0) + qty;
      log.push(`Looted ${qty} ${itemId}`);
    }
    let { level, xp } = state.skills.combat;
    xp += enemy.xp;
    while (xp >= level * 100) {
      xp -= level * 100;
      level += 1;
    }
    const newPlayer = {
      ...state.player,
      credits: state.player.credits + rewards.credits,
    };
    if (rewards.credits > 0) {
      log.push(`Gained ${rewards.credits} credits`);
    }
    log.push(`Defeated ${enemy.name}`);
    return {
      ...state,
      player: newPlayer,
      skills: { ...state.skills, combat: { level, xp } },
      inventory: inv,
      combat: { enemyId: null, enemyHp: 0, inFight: false, log: trimLog(log) },
    };
  });
}

export function attack() {
  const state = useGameStore.getState();
  if (!state.combat.inFight || !state.combat.enemyId) return;
  const enemy = getEnemy(state.combat.enemyId);
  if (!enemy) return;
  let enemyHp = state.combat.enemyHp;
  const log = [...state.combat.log];

  const dmgToEnemy = calcDamage(state.player.atk, enemy.def);
  enemyHp -= dmgToEnemy;
  log.push(`You hit ${enemy.name} for ${dmgToEnemy}`);

  if (enemyHp <= 0) {
    awardVictory(enemy, log);
    return;
  }

  const dmgToPlayer = calcDamage(enemy.atk, state.player.def);
  const playerHp = state.player.hp - dmgToPlayer;
  log.push(`${enemy.name} hits you for ${dmgToPlayer}`);

  if (playerHp <= 0) {
    log.push('You were defeated');
    useGameStore.setState((s) => ({
      ...s,
      player: { ...s.player, hp: 1 },
      combat: { enemyId: null, enemyHp: 0, inFight: false, log: trimLog(log) },
    }));
    return;
  }

  useGameStore.setState((s) => ({
    ...s,
    player: { ...s.player, hp: playerHp },
    combat: { ...s.combat, enemyHp, log: trimLog(log) },
  }));
}

export function flee() {
  useGameStore.setState((s) => ({
    ...s,
    combat: {
      enemyId: null,
      enemyHp: 0,
      inFight: false,
      log: trimLog([...s.combat.log, 'Fled from battle']),
    },
  }));
}

export function quickHeal() {
  useGameStore.setState((s) => ({
    ...s,
    player: { ...s.player, hp: s.player.hpMax },
  }));
}
