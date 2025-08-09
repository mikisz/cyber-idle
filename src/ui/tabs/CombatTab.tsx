import { useState } from 'react';
import { attack, flee, quickHeal, startCombat } from '../../game/combat';
import { enemies, getEnemyById } from '../../data/enemies';
import { useGameStore } from '../../game/state/store';
import type { Tab } from '../AppShell';

interface Props {
  onNavigate?: (tab: Tab) => void;
}

export default function CombatTab({ onNavigate }: Props) {
  const combat = useGameStore((s) => s.combat);
  const player = useGameStore((s) => s.player);
  const [selected, setSelected] = useState(enemies[0]?.id ?? '');

  const enemy = combat.enemyId ? getEnemyById(combat.enemyId) : null;

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
          {combat.fromExploration && (
            <button
              onClick={() => {
                useGameStore.setState((s) => ({
                  ...s,
                  combat: { ...s.combat, fromExploration: false },
                }));
                onNavigate?.('exploration');
              }}
            >
              Continue Exploring
            </button>
          )}
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
