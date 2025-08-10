import { useState } from 'react';
import { getEnemyById } from '../../data/enemies';
import { getItem } from '../../data/items';
import { attack, flee } from '../../game/combat';
import { consume } from '../../game/shop';
import { useGameStore } from '../../game/state/store';
import { showToast } from '../Toast';
import ButtonNeon from './ButtonNeon';
import ProgressBarNeon from './ProgressBarNeon';

export default function CombatPanel() {
  const combat = useGameStore((s) => s.combat);
  const player = useGameStore((s) => s.player);
  const equipped = useGameStore((s) => s.equipped);
  const inventory = useGameStore((s) => s.inventory);
  const [showItems, setShowItems] = useState(false);

  const enemy = combat.enemyId ? getEnemyById(combat.enemyId) : null;
  const weapon =
    equipped.weapon ? getItem(equipped.weapon)?.name ?? equipped.weapon : 'None';
  const armor =
    equipped.armor ? getItem(equipped.armor)?.name ?? equipped.armor : 'None';

  const healingItems = Object.entries(inventory)
    .filter(([id, qty]) => qty > 0 && getItem(id)?.effect?.heal)
    .map(([id, qty]) => ({ id, qty, item: getItem(id)! }));

  const handleUseItem = (id: string) => {
    const before = useGameStore.getState().player.hp;
    const used = consume(id);
    if (used) {
      const after = useGameStore.getState().player.hp;
      const healed = after - before;
      const item = getItem(id);
      if (item?.effect?.heal) {
        showToast(`+${healed} HP (${item.name})`);
      }
    }
    setShowItems(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 border p-2">
        <div>Player HP: {player.hp} / {player.hpMax}</div>
        <ProgressBarNeon
          percentage={(player.hp / player.hpMax) * 100}
          className="mt-1"
        />
        <div className="text-sm">ATK {player.atk} DEF {player.def}</div>
        <div className="text-sm">Weapon: {weapon} / Armor: {armor}</div>
      </div>
      <div className="space-y-2 border p-2">
        <div>
          {enemy?.name} HP: {combat.enemyHp} / {enemy?.hp}
        </div>
        <ProgressBarNeon
          percentage={enemy ? (combat.enemyHp / enemy.hp) * 100 : 0}
          color="magenta"
          className="mt-1"
        />
        <div className="text-sm">ATK {enemy?.atk}</div>
        <div className="text-sm">{enemy?.description}</div>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto border p-2">
        {combat.log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 border-t pt-2">
        <div className="flex justify-center gap-2">
          <ButtonNeon onClick={attack}>Attack</ButtonNeon>
          <ButtonNeon
            onClick={() => setShowItems((v) => !v)}
            disabled={healingItems.length === 0}
            title={healingItems.length === 0 ? 'No healing items available' : undefined}
          >
            Use Item
          </ButtonNeon>
          <ButtonNeon onClick={flee}>Flee</ButtonNeon>
        </div>
        {showItems && healingItems.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {healingItems.map(({ id, qty, item }) => (
              <ButtonNeon
                key={id}
                onClick={() => handleUseItem(id)}
                className="px-2"
              >
                {item.name}
                {qty > 1 && ` x${qty}`}
              </ButtonNeon>
            ))}
          </div>
        )}
        {healingItems.length === 0 && (
          <div className="text-sm text-neon-magenta">No healing items</div>
        )}
      </div>
    </div>
  );
}
