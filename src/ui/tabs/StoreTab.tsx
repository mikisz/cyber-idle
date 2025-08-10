import {
  items,
  getItem,
  ITEM_TYPE_ICONS,
  type ItemType,
} from '../../data/items';
import { useGameStore } from '../../game/state/store';
import { buyItem } from '../../game/shop';
import { showToast } from '../Toast';
import { useState } from 'react';
import Card from '../components/Card';
import ButtonNeon from '../components/ButtonNeon';
import SectionHeader from '../components/SectionHeader';
import Modal from '../components/Modal';

export default function StoreTab() {
  const credits = useGameStore((s) => s.resources.credits);
  const categories: { id: ItemType; label: string }[] = [
    { id: 'consumable', label: 'Consumables' },
    { id: 'weapon', label: 'Weapons' },
    { id: 'armor', label: 'Armor' },
    { id: 'upgrade', label: 'Upgrades' },
    { id: 'misc', label: 'Misc' },
  ];
  const [category, setCategory] = useState<ItemType>('consumable');
  const available = items.filter(
    (i) => i.type === category && i.source !== 'loot-only'
  );
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

  return (
    <Card className="space-y-4 p-4">
      <SectionHeader>Store</SectionHeader>
      <div className="flex gap-2">
        {categories.map((c) => (
          <ButtonNeon
            key={c.id}
            variant={category === c.id ? 'success' : 'neutral'}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </ButtonNeon>
        ))}
      </div>
      <ul className="space-y-2">
        {available.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <div>
              <div>
                {ITEM_TYPE_ICONS[item.type]} {item.name}
              </div>
              <div className="text-sm text-neon-cyan">{item.description}</div>
              <div className="text-sm text-neon-cyan">Credits: {item.value}</div>
            </div>
            <ButtonNeon
              disabled={credits < item.value}
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
            Buy {selectedItem.name} for {selectedItem.value} credits?
          </div>
        )}
      </Modal>
    </Card>
  );
}
