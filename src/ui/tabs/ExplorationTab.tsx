import { useState } from 'react';
import type { Tab } from '../AppShell';
import { locations } from '../../data/locations';
import { getEnemyById } from '../../data/enemies';
import { getItem } from '../../data/items';
import { setLocation, explore } from '../../game/exploration';
import { addItemToInventory } from '../../game/items';
import { useGameStore } from '../../game/state/store';
import Card from '../components/Card';
import ButtonNeon from '../components/ButtonNeon';
import SectionHeader from '../components/SectionHeader';
import Modal from '../components/Modal';

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
    <Card className="space-y-4 p-4">
      <SectionHeader>Exploration</SectionHeader>
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
      <ButtonNeon onClick={handleExplore} disabled={!currentLocation}>
        Explore
      </ButtonNeon>
      <div className="space-y-1">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <Modal
        open={loot !== null}
        onClose={() => setLoot(null)}
        actions={<ButtonNeon onClick={confirmLoot}>Continue</ButtonNeon>}
      >
        You found {getItem(loot?.itemId ?? '')?.name ?? loot?.itemId}!
      </Modal>
    </Card>
  );
}
