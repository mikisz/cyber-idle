import { useGameStore } from '../../game/state/store';
import { equipItem, unequipItem } from '../../game/items';
import { consume } from '../../game/shop';
import { getItem } from '../../data/items';
import { showToast } from '../Toast';
import ButtonNeon from '../components/ButtonNeon';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

function ItemStats({ id }: { id: string }) {
  const item = getItem(id);
  if (!item) return null;
  const stats = [] as string[];
  if (item.stats?.atk) stats.push(`ATK +${item.stats.atk}`);
  if (item.stats?.def) stats.push(`DEF +${item.stats.def}`);
  if (item.stats?.hpMax) stats.push(`HP +${item.stats.hpMax}`);
  if (item.stats?.hackingSpeed)
    stats.push(`Hack x${item.stats.hackingSpeed.toFixed(2)}`);
  if (item.stats?.explorationChance)
    stats.push(`Explore +${item.stats.explorationChance}%`);
  if (item.effect?.heal) stats.push(`Heal ${item.effect.heal}`);
  return <div className="text-sm text-neon-cyan">{stats.join(', ')}</div>;
}

export default function InventoryTab() {
  const inventory = useGameStore((s) => s.inventory);
  const equipped = useGameStore((s) => s.equipped);

  const handleItem = (id: string) => {
    const item = getItem(id);
    if (!item) return;
    if (item.type === 'consumable') {
      const used = consume(id);
      if (used && item.effect?.heal) {
        showToast(`+${item.effect.heal} HP (${item.name})`);
      }
    } else {
      equipItem(id);
    }
  };

  const renderSlot = (slot: 'weapon' | 'armor' | 'accessory') => {
    const id = equipped[slot];
    const item = id ? getItem(id) : null;
    return (
      <ButtonNeon
        key={slot}
        className="w-28 flex flex-col items-start"
        onClick={() => id && unequipItem(slot)}
      >
        <div className="font-bold">{slot.charAt(0).toUpperCase() + slot.slice(1)}</div>
        <div>{item ? item.name : 'Empty'}</div>
        {id && <ItemStats id={id} />}
      </ButtonNeon>
    );
  };

  return (
    <Card className="space-y-4 p-4">
      <div className="space-y-2">
        <SectionHeader>Equipped</SectionHeader>
        <div className="flex gap-2">
          {renderSlot('weapon')}
          {renderSlot('armor')}
          {renderSlot('accessory')}
        </div>
      </div>
      <div className="space-y-2">
        <SectionHeader>Inventory</SectionHeader>
        {Object.keys(inventory).length === 0 ? (
          <div>Empty</div>
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {Object.entries(inventory).map(([id, qty]) => {
              const item = getItem(id);
              return (
                <li key={id}>
                  <ButtonNeon
                    className="w-full flex flex-col items-start text-left"
                    onClick={() => handleItem(id)}
                  >
                    <div>
                      {item?.name ?? id}
                      {qty > 1 && ` x${qty}`}
                    </div>
                    {item && <ItemStats id={id} />}
                  </ButtonNeon>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
