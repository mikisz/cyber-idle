import { useGameStore } from './state/store';
import { getEnemyById, type Enemy, getEnemyXp } from '../data/enemies';
import { getItem } from '../data/items';
import { rollLoot } from '../data/lootTables';
import { addItemToInventory } from './items';
import { addCombatXp } from './skills';
import { showToast } from '../ui/Toast';

export function calcDamage(atk: number, def: number): number {
  const variance = Math.floor(Math.random() * 3) - 1; // -1,0,1
  return Math.max(1, atk + variance - def);
}

function trimLog(log: string[]): string[] {
  return log.slice(-10);
}

export function startCombat(enemyId: string, opts?: { fromExploration?: boolean }) {
  const enemy = getEnemyById(enemyId);
  if (!enemy) return;
  useGameStore.setState((s) => ({
    ...s,
    combat: {
      enemyId,
      enemyHp: enemy.hp,
      inFight: true,
      log: [`Engaged ${enemy.name}`],
      fromExploration: opts?.fromExploration ?? false,
    },
  }));
}

function awardVictory(enemy: Enemy, log: string[]) {
  const state = useGameStore.getState();
  const { items, credits: lootCredits } = rollLoot(state.location ?? '');
  const lootMessages: string[] = [];
  for (const drop of items) {
    const item = getItem(drop.itemId);
    lootMessages.push(
      `Looted ${drop.quantity > 1 ? `${drop.quantity}x ` : ''}${item?.name ?? drop.itemId}`,
    );
  }
  if (lootCredits > 0) {
    lootMessages.push(`Looted ${lootCredits} credits`);
  }
  const gainedXp = getEnemyXp(enemy);
  addCombatXp(gainedXp);
  const fromExploration = state.combat.fromExploration;
  useGameStore.setState((s) => {
    const resources = { ...s.resources };
    resources.credits += lootCredits;
    if (enemy.creditsDrop) {
      const { min, max } = enemy.creditsDrop;
      const credits = Math.floor(Math.random() * (max - min + 1)) + min;
      resources.credits += credits;
      lootMessages.push(`Looted ${credits} credits`);
    }
    return {
      ...s,
      resources,
      combat: {
        enemyId: null,
        enemyHp: 0,
        inFight: false,
        log: trimLog([...log, ...lootMessages, `Defeated ${enemy.name}`]),
        fromExploration,
      },
    };
  });
  showToast(`+${gainedXp} Combat XP`);
  for (const drop of items) {
    addItemToInventory(drop.itemId, drop.quantity);
  }
}

function handleDefeat(log: string[]) {
  useGameStore.setState((s) => {
    const lost = Math.floor(s.resources.credits * 0.1);
    const newLog = [...log, `You were defeated and lost ${lost} credits`];
    return {
      ...s,
      resources: { ...s.resources, credits: s.resources.credits - lost },
      player: { ...s.player, hp: s.player.hpMax },
      combat: {
        enemyId: null,
        enemyHp: 0,
        inFight: false,
        log: trimLog(newLog),
        fromExploration: false,
      },
      location: null,
    };
  });
}

export function attack() {
  const state = useGameStore.getState();
  if (!state.combat.inFight || !state.combat.enemyId) return;
  const enemy = getEnemyById(state.combat.enemyId);
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
  const enemy = getEnemyById(state.combat.enemyId);
  if (!enemy) return;
  const log = [...state.combat.log];
  if (Math.random() < 0.75) {
    log.push('You fled the battle');
    useGameStore.setState((s) => ({
      ...s,
      combat: {
        enemyId: null,
        enemyHp: 0,
        inFight: false,
        log: trimLog(log),
        fromExploration: state.combat.fromExploration,
      },
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
