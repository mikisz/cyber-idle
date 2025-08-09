import { useGameStore } from './state/store';
import { getEnemy, type Enemy } from '../data/enemies';
import { getItem } from '../data/items';

export function calcDamage(atk: number, def: number): number {
  const variance = Math.floor(Math.random() * 3) - 1; // -1,0,1
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

function rollLoot(enemy: Enemy): string[] {
  const drops: string[] = [];
  for (const entry of enemy.dropTable) {
    if (Math.random() < entry.dropChance) {
      drops.push(entry.itemId);
    }
  }
  return drops;
}

function awardVictory(enemy: Enemy, log: string[]) {
  useGameStore.setState((state) => {
    const drops = rollLoot(enemy);
    const inventory = [...state.inventory];
    const player = { ...state.player };
    for (const itemId of drops) {
      const item = getItem(itemId);
      if (item?.type === 'currency') {
        player.credits += item.value ?? 0;
      } else {
        inventory.push(itemId);
      }
      log.push(`Looted ${item?.name ?? itemId}`);
    }
    let { level, xp } = state.skills.combat;
    xp += 10; // placeholder xp per victory
    while (xp >= level * 100) {
      xp -= level * 100;
      level += 1;
    }
    log.push(`Defeated ${enemy.name}`);
    return {
      ...state,
      player,
      inventory,
      skills: { ...state.skills, combat: { level, xp } },
      combat: { enemyId: null, enemyHp: 0, inFight: false, log: trimLog(log) },
    };
  });
}

function handleDefeat(log: string[]) {
  useGameStore.setState((s) => {
    const lost = Math.floor(s.player.credits * 0.1);
    const newLog = [...log, `You were defeated and lost ${lost} credits`];
    return {
      ...s,
      player: { ...s.player, hp: s.player.hpMax, credits: s.player.credits - lost },
      combat: { enemyId: null, enemyHp: 0, inFight: false, log: trimLog(newLog) },
      location: null,
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

  const dmgToEnemy = calcDamage(state.player.atk, 0);
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
    handleDefeat(log);
    return;
  }

  useGameStore.setState((s) => ({
    ...s,
    player: { ...s.player, hp: playerHp },
    combat: { ...s.combat, enemyHp, log: trimLog(log) },
  }));
}

export function flee() {
  const state = useGameStore.getState();
  if (!state.combat.inFight || !state.combat.enemyId) return;
  const enemy = getEnemy(state.combat.enemyId);
  if (!enemy) return;
  const log = [...state.combat.log];
  if (Math.random() < 0.75) {
    log.push('You fled the battle');
    useGameStore.setState((s) => ({
      ...s,
      combat: { enemyId: null, enemyHp: 0, inFight: false, log: trimLog(log) },
    }));
    return;
  }
  log.push('Failed to flee');
  const dmg = calcDamage(enemy.atk, state.player.def);
  const hp = state.player.hp - dmg;
  log.push(`${enemy.name} hits you for ${dmg}`);
  if (hp <= 0) {
    handleDefeat(log);
    return;
  }
  useGameStore.setState((s) => ({
    ...s,
    player: { ...s.player, hp },
    combat: { ...s.combat, log: trimLog(log) },
  }));
}

export function quickHeal() {
  useGameStore.setState((s) => ({
    ...s,
    player: { ...s.player, hp: s.player.hpMax },
  }));
}
