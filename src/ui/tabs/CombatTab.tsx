import { useState } from 'react';
import {
  attack,
  flee,
  quickHeal,
  startCombat,
  enemies,
  getEnemy,
} from '../../game/combat';
import { useGameStore } from '../../game/state/store';

export default function CombatTab() {
  const combat = useGameStore((s) => s.combat);
  const player = useGameStore((s) => s.player);
  const [selected, setSelected] = useState(enemies[0]?.id ?? '');

  const enemy = combat.enemyId ? getEnemy(combat.enemyId) : null;

  return (
    <div className="space-y-4 p-4">
      {!combat.inFight ? (
        <div className="space-y-4">
          <div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="bg-black"
            >
              {enemies.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => startCombat(selected)} disabled={!selected}>
            Engage
          </button>
          <button onClick={quickHeal}>Quick Heal</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            Player HP: {player.hp} / {player.hpMax}
          </div>
          <div>
            {enemy?.name} HP: {combat.enemyHp} / {enemy?.hp}
          </div>
          <div className="space-y-1">
            {combat.log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={attack}>Attack</button>
            <button onClick={flee}>Flee</button>
            <button onClick={quickHeal}>Quick Heal</button>
          </div>
        </div>
      )}
    </div>
  );
}
