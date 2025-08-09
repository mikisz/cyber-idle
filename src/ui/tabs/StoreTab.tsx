import { items, getItem } from '../../data/items';
import { useGameStore } from '../../game/state/store';
import { buyConsumable } from '../../game/shop';
import { showToast } from '../Toast';

export default function StoreTab() {
  const credits = useGameStore((s) => s.resources.credits);
  const consumables = items.filter(
    (i) =>
      i.type === 'consumable' &&
      (i.source === 'shop-only' || i.source === 'both')
  );

  const buy = (id: string) => {
    const item = getItem(id);
    if (!item) return;
    const success = buyConsumable(id);
    if (success) {
      showToast(`Purchased: ${item.name}`);
    }
  };

  return (
    <div className="space-y-4 p-4">
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
                Credits: {item.buyPriceCredits ?? 0}
              </div>
            </div>
            <button
              disabled={credits < (item.buyPriceCredits ?? 0)}
              onClick={() => buy(item.id)}
            >
              Buy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
