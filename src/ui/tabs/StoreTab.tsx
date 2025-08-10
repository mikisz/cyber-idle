import { items, getItem, type Item } from '../../data/items';
import { useGameStore } from '../../game/state/store';
import { buyItem } from '../../game/shop';
import { showToast } from '../Toast';
import { useState } from 'react';
import Card from '../components/Card';
import ButtonNeon from '../components/ButtonNeon';
import SectionHeader from '../components/SectionHeader';
import Modal from '../components/Modal';

const typeIcons: Record<Item['type'], string> = {
  weapon: '🗡️',
  armor: '🛡️',
  consumable: '💊',
  accessory: '🔩',
  misc: '📦',
};

export default function StoreTab() {
  const resources = useGameStore((s) => s.resources);
  const credits = resources.credits;
  const data = resources.data;
  const shopItems = items.filter(
    (i) => i.source === 'shop-only' || i.source === 'both',
  );

  const categories: { label: string; type: Item['type'] }[] = [
    { label: 'Consumables', type: 'consumable' },
    { label: 'Weapons', type: 'weapon' },
    { label: 'Armor', type: 'armor' },
    { label: 'Upgrades', type: 'accessory' },
    { label: 'Misc', type: 'misc' },
  ];

  const [category, setCategory] = useState<Item['type']>('consumable');
  
  const [pending, setPending] = useState<string | null>(null);

  const confirmPurchase = () => {
    if (!pending) return;
    const item = getItem(pending);
    if (!item) return;
    const success = buyItem(pending);
    if (success) {
      showToast(`Purchased: ${item.name}`);
    }
    setPending(null);
  };

  const selectedItem = pending ? getItem(pending) : null;

  const visibleItems = shopItems.filter((i) => i.type === category);

  return (
    <Card className="space-y-4 p-4">
      <SectionHeader>Store</SectionHeader>
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <ButtonNeon
            key={c.label}
            onClick={() => setCategory(c.type)}
            variant={category === c.type ? 'success' : 'neutral'}
          >
            {c.label}
          </ButtonNeon>
        ))}
      </div>
      <ul className="grid gap-2">
        {visibleItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <div>
              <div>
                {typeIcons[item.type]} {item.name}
              </div>
              <div className="text-sm text-neon-cyan">{item.description}</div>
              <div className="text-sm text-neon-cyan">
                {item.buyPriceData
                  ? `Data: ${item.buyPriceData}`
                  : `Credits: ${item.buyPriceCredits ?? 0}`}
              </div>
            </div>
            <ButtonNeon
              disabled={
                item.buyPriceData
                  ? data < item.buyPriceData
                  : credits < (item.buyPriceCredits ?? 0)
              }
              onClick={() => setPending(item.id)}
            >
              Buy
            </ButtonNeon>
          </li>
        ))}
      </ul>
      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        actions={
          pending && (
            <>
              <ButtonNeon onClick={confirmPurchase}>Confirm</ButtonNeon>
              <ButtonNeon variant="danger" onClick={() => setPending(null)}>
                Cancel
              </ButtonNeon>
            </>
          )
        }
      >
        {selectedItem && (
          <div>
            Buy {selectedItem.name} for{' '}
            {selectedItem.buyPriceData ?? selectedItem.buyPriceCredits ?? 0}{' '}
            {selectedItem.buyPriceData ? 'data' : 'credits'}?
          </div>
        )}
      </Modal>
    </Card>
  );
}
