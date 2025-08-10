import { useGameStore } from '../../game/state/store';
import { equipItem, unequipItem } from '../../game/items';
import { consume, sellItem } from '../../game/shop';
import { getItem, type Item } from '../../data/items';
import { showToast } from '../Toast';
import ButtonNeon from '../components/ButtonNeon';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import { useState } from 'react';

const typeIcons: Record<Item['type'], string> = {
  weapon: '🗡️',
  armor: '🛡️',
  consumable: '💊',
  accessory: '🔩',
  misc: '📦',
};

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
  const [selected, setSelected] = useState<string | null>(null);

  const selectedItem = selected ? getItem(selected) : null;

  const handleUse = () => {
    if (!selectedItem) return;
    if (selectedItem.type === 'consumable') {
      const used = consume(selectedItem.id);
      if (used && selectedItem.effect?.heal) {
        showToast(`+${selectedItem.effect.heal} HP (${selectedItem.name})`);
      }
    } else {
      equipItem(selectedItem.id);
    }
    setSelected(null);
  };

  const handleSell = () => {
    if (!selectedItem) return;
    const sold = sellItem(selectedItem.id);
    if (sold) {
      showToast(`Sold ${selectedItem.name} for ${selectedItem.value} credits.`);
      setSelected(null);
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
          <div>
            <ul className="grid grid-cols-2 gap-2">
              {Object.entries(inventory).map(([id, qty]) => {
                const item = getItem(id);
                return (
                  <li key={id}>
                    <ButtonNeon
                      className="w-full flex flex-col items-start text-left"
                      onClick={() => setSelected(id)}
                    >
                      <div>
                        {item ? typeIcons[item.type] : ''} {item?.name ?? id}
                        {qty > 1 && ` x${qty}`}
                      </div>
                      {item && <ItemStats id={id} />}
                    </ButtonNeon>
                  </li>
                );
              })}
            </ul>
            {selectedItem && (
              <div className="mt-4 p-2 border border-neon-cyan flex flex-col gap-1">
                <div className="font-bold">
                  {typeIcons[selectedItem.type]} {selectedItem.name}
                </div>
                <div className="text-sm">{selectedItem.description}</div>
                <div className="text-sm text-neon-cyan">
                  Value: {selectedItem.value} credits
                </div>
                {selectedItem.rarity && (
                  <div className="text-sm text-neon-cyan">
                    Rarity: {selectedItem.rarity}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <ButtonNeon onClick={handleUse} disabled={!selectedItem}>
                    {selectedItem.type === 'consumable' ? 'Use' : 'Equip'}
                  </ButtonNeon>
                  <ButtonNeon
                    onClick={handleSell}
                    disabled={Object.values(equipped).includes(selectedItem.id)}
                  >
                    Sell
                  </ButtonNeon>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
