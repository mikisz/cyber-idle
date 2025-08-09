import { useGameStore } from '../../game/state/store';
import { consumeItem, equipItem, unequipItem } from '../../game/items';
import { getItem } from '../../data/items';
import { showToast } from '../Toast';

function ItemStats({ id }: { id: string }) {
  const item = getItem(id);
  if (!item) return null;
  const stats = [] as string[];
  if (item.stats?.atk) stats.push(`ATK +${item.stats.atk}`);
  if (item.stats?.hpMax) stats.push(`HP +${item.stats.hpMax}`);
  if (item.stats?.hackingSpeed)
    stats.push(`Hack Speed +${Math.round(item.stats.hackingSpeed * 100)}%`);
  return <div className="text-sm text-neon-cyan">{stats.join(', ')}</div>;
}

export default function InventoryTab() {
  const inventory = useGameStore((s) => s.inventory);
  const equipped = useGameStore((s) => s.equipped);

  const handleItem = (id: string) => {
    const item = getItem(id);
    if (!item) return;
    if (item.type === 'consumable') {
      const used = consumeItem(id);
      if (used && id === 'medkit_small') {
        showToast('+50 HP (Medkit)');
      }
    } else {
      equipItem(id);
    }
  };

  const renderSlot = (slot: 'weapon' | 'armor' | 'accessory') => {
    const id = equipped[slot];
    const item = id ? getItem(id) : null;
    return (
      <button
        key={slot}
        className="w-28 border border-neon-cyan p-2"
        onClick={() => id && unequipItem(slot)}
      >
        <div className="font-bold">{slot.charAt(0).toUpperCase() + slot.slice(1)}</div>
        <div>{item ? item.name : 'Empty'}</div>
        {id && <ItemStats id={id} />}
      </button>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <div className="font-bold">Equipped</div>
        <div className="flex gap-2">
          {renderSlot('weapon')}
          {renderSlot('armor')}
          {renderSlot('accessory')}
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-bold">Inventory</div>
        {inventory.length === 0 ? (
          <div>Empty</div>
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {inventory.map((id, i) => {
              const item = getItem(id);
              return (
                <li key={`${id}-${i}`}>
                  <button
                    className="w-full border border-neon-cyan p-2 text-left"
                    onClick={() => handleItem(id)}
                  >
                    <div>{item?.name ?? id}</div>
                    {item && <ItemStats id={id} />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
