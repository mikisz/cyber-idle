import { useGameStore } from '../../game/state/store';
import { equipItem, unequipItem } from '../../game/items';
import { consume } from '../../game/shop';
import { getItem } from '../../data/items';
import { showToast } from '../Toast';

function ItemStats({ id }: { id: string }) {
  const item = getItem(id);
  if (!item) return null;
  const stats = [] as string[];
  if (item.stats?.attack) stats.push(`ATK +${item.stats.attack}`);
  if (item.stats?.defense) stats.push(`DEF +${item.stats.defense}`);
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
        {Object.keys(inventory).length === 0 ? (
          <div>Empty</div>
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {Object.entries(inventory).map(([id, qty]) => {
              const item = getItem(id);
              return (
                <li key={id}>
                  <button
                    className="w-full border border-neon-cyan p-2 text-left"
                    onClick={() => handleItem(id)}
                  >
                    <div>
                      {item?.name ?? id}
                      {qty > 1 && ` x${qty}`}
                    </div>
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
