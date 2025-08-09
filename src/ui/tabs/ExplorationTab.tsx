import { useState } from 'react';
import type { Tab } from '../AppShell';
import { locations } from '../../data/locations';
import { getEnemyById } from '../../data/enemies';
import { getItem } from '../../data/items';
import { setLocation, explore } from '../../game/exploration';
import { addItemToInventory } from '../../game/items';
import { useGameStore } from '../../game/state/store';

interface Props {
  onNavigate: (tab: Tab) => void;
}

export default function ExplorationTab({ onNavigate }: Props) {
  const currentLocation = useGameStore((s) => s.location);
  const log = useGameStore((s) => s.explorationLog);
  const [loot, setLoot] = useState<{ itemId: string; quantity: number } | null>(null);

  const appendLog = (entry: string) => {
    useGameStore.setState((s) => ({
      ...s,
      explorationLog: [...s.explorationLog, entry].slice(-5),
    }));
  };

  const handleExplore = () => {
    const result = explore();
    if (!result) return;
    if (result.type === 'enemy') {
      const enemy = getEnemyById(result.enemyId);
      appendLog(`Encountered ${enemy?.name ?? result.enemyId}`);
      onNavigate('combat');
    } else if (result.type === 'loot') {
      setLoot({ itemId: result.itemId, quantity: result.quantity });
    } else if (result.type === 'credits') {
      appendLog(`Found ${result.amount} credits`);
    } else {
      appendLog('Found nothing');
    }
  };

  const confirmLoot = () => {
    if (!loot) return;
    addItemToInventory(loot.itemId, loot.quantity);
    const item = getItem(loot.itemId);
    appendLog(
      `Found ${loot.quantity > 1 ? `${loot.quantity}x ` : ''}${item?.name ?? loot.itemId}`,
    );
    setLoot(null);
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <select
          value={currentLocation ?? ''}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-black"
        >
          <option value="">Select Location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleExplore} disabled={!currentLocation}>
        Explore
      </button>
      <div className="space-y-1">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      {loot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="space-y-4 bg-background p-4 text-center">
            <div>You found {getItem(loot.itemId)?.name ?? loot.itemId}!</div>
            <button onClick={confirmLoot}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}
