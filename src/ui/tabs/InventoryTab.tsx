import { useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { equipItem, unequipItem, sellItem } from '../../game/items';
import { consume } from '../../game/shop';
import { getItem, ITEM_TYPE_ICONS } from '../../data/items';
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
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = selected ? getItem(selected) : null;
  const selectedQty = selected ? inventory[selected] ?? 0 : 0;
  const isEquipped = selected
    ? (Object.values(equipped) as (string | null)[]).includes(selected)
    : false;

  const handleUseEquip = () => {
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
                      {ITEM_TYPE_ICONS[item?.type ?? 'misc']} {item?.name ?? id}
                      {qty > 1 && ` x${qty}`}
                    </div>
                    {item && <ItemStats id={id} />}
                  </ButtonNeon>
                </li>
              );
            })}
          </ul>
        )}
        {selectedItem && (
          <div className="mt-4 space-y-1 border-t pt-2">
            <div className="font-bold">
              {ITEM_TYPE_ICONS[selectedItem.type]} {selectedItem.name}
              {selectedQty > 1 && ` x${selectedQty}`}
            </div>
            <div className="text-sm text-neon-cyan">{selectedItem.description}</div>
            <div className="text-sm text-neon-cyan">Type: {selectedItem.type}</div>
            <div className="text-sm text-neon-cyan">
              Value: {selectedItem.value} credits
            </div>
            {selectedItem.rarity && (
              <div className="text-sm text-neon-cyan">
                Rarity: {selectedItem.rarity}
              </div>
            )}
            <ItemStats id={selectedItem.id} />
            <div className="mt-2 flex gap-2">
              <ButtonNeon onClick={handleUseEquip}>
                {selectedItem.type === 'consumable' ? 'Use' : 'Equip'}
              </ButtonNeon>
              <ButtonNeon
                variant="danger"
                disabled={isEquipped}
                onClick={handleSell}
              >
                Sell
              </ButtonNeon>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
