import { useGameStore } from './state/store';
import { getEnemyById, type Enemy, getEnemyXp } from '../data/enemies';
import { getItem } from '../data/items';
import { rollLoot } from '../data/lootTables';
import { addItemToInventory } from './items';
import { gainSkillXpState } from './skills';
import { showToast } from '../ui/Toast';

export function calcDamage(atk: number, def: number): number {
  const variance = Math.floor(Math.random() * 3) - 1; // -1,0,1
  return Math.max(1, atk + variance - def);
}

function trimLog(log: string[]): string[] {
  return log.slice(-10);
}

export function startCombat(enemyId: string) {
  const enemy = getEnemyById(enemyId);
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

function awardVictory(enemy: Enemy, log: string[]) {
  const state = useGameStore.getState();
  const { items, credits: lootCredits } = rollLoot(
    state.exploration.currentLocationId ?? '',
  );
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
  let playerLeveled = false;
  useGameStore.setState((s) => {
    const xpRes = gainSkillXpState(s, 'combat', gainedXp);
    playerLeveled = xpRes.playerLeveled;
    const resources = { ...xpRes.state.resources };
    resources.credits += lootCredits;
    if (enemy.creditsDrop) {
      const { min, max } = enemy.creditsDrop;
      const credits = Math.floor(Math.random() * (max - min + 1)) + min;
      resources.credits += credits;
      lootMessages.push(`Looted ${credits} credits`);
    }
    return {
      ...xpRes.state,
      resources,
      combat: {
        enemyId: null,
        enemyHp: 0,
        inFight: false,
        log: trimLog([...log, ...lootMessages, `Defeated ${enemy.name}`]),
      },
      exploration: {
        ...xpRes.state.exploration,
        view: 'location',
        currentEnemyId: null,
        lastEvent: {
          type: 'enemy',
          summary: `Defeated ${enemy.name}`,
          credits: lootCredits,
          itemId: items[0]?.itemId,
        },
        recentLog: trimLog([
          ...xpRes.state.exploration.recentLog,
          `Defeated ${enemy.name}`,
        ]),
      },
    };
  });
  showToast(`+${gainedXp} Combat XP`);
  if (playerLeveled) {
    showToast(`Reached Level ${useGameStore.getState().playerLevel}`);
  }
  for (const drop of items) {
    addItemToInventory(drop.itemId, drop.quantity);
  }
}

function handleDefeat(enemy: Enemy, log: string[]) {
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
      },
      exploration: {
        ...s.exploration,
        view: 'location',
        currentEnemyId: null,
        lastEvent: { type: 'enemy', summary: `Defeated by ${enemy.name}` },
        recentLog: trimLog([
          ...s.exploration.recentLog,
          `Defeated by ${enemy.name}`,
        ]),
      },
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
    handleDefeat(enemy, log);
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
      },
      exploration: {
        ...s.exploration,
        view: 'location',
        currentEnemyId: null,
        lastEvent: { type: 'enemy', summary: `Fled from ${enemy.name}` },
        recentLog: trimLog([
          ...s.exploration.recentLog,
          `Fled from ${enemy.name}`,
        ]),
      },
    }));
    return;
  }
  log.push('Failed to flee');
  const dmg = calcDamage(enemy.atk, state.player.def);
  const hp = state.player.hp - dmg;
  log.push(`${enemy.name} hits you for ${dmg}`);
  if (hp <= 0) {
    handleDefeat(enemy, log);
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
