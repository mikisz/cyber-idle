import { items, getItem } from '../../data/items';
import { useGameStore } from '../../game/state/store';
import { buyConsumable } from '../../game/shop';
import { showToast } from '../Toast';
import { useState } from 'react';
import Card from '../components/Card';
import ButtonNeon from '../components/ButtonNeon';
import SectionHeader from '../components/SectionHeader';
import Modal from '../components/Modal';

export default function StoreTab() {
  const resources = useGameStore((s) => s.resources);
  const credits = resources.credits;
  const data = resources.data;
  const consumables = items.filter(
    (i) =>
      i.type === 'consumable' &&
      (i.source === 'shop-only' || i.source === 'both')
  );

  const [pending, setPending] = useState<string | null>(null);

  const confirmPurchase = () => {
    if (!pending) return;
    const item = getItem(pending);
    if (!item) return;
    const success = buyConsumable(pending);
    if (success) {
      showToast(`Purchased: ${item.name}`);
    }
    setPending(null);
  };

  const selectedItem = pending ? getItem(pending) : null;

  return (
    <Card className="space-y-4 p-4">
      <SectionHeader>Store</SectionHeader>
      <ul className="space-y-2">
        {consumables.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <div>
              <div>
                {item.iconText} {item.name}
              </div>
              {item.description && (
                <div className="text-sm text-neon-cyan">{item.description}</div>
              )}
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
