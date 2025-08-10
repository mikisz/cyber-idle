import { useGameStore } from '../../game/state/store';
import { locations, getLocation } from '../../data/locations';
import { getEnemyById } from '../../data/enemies';
import { getItem } from '../../data/items';
import { setLocation, rollExplorationEvent, clearEncounter } from '../../game/exploration';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import ButtonNeon from '../components/ButtonNeon';
import Modal from '../components/Modal';
import CombatPanel from '../components/CombatPanel';
const locationStyles: Record<string, string> = {
  slums: 'border-neon-magenta hover:shadow-[0_0_8px_#ff00ff]',
  corporate_district: 'border-neon-cyan hover:shadow-[0_0_8px_#00ffff]',
};

export default function ExplorationTab() {
  const exploration = useGameStore((s) => s.exploration);
  const currentLocation = exploration.currentLocationId
    ? getLocation(exploration.currentLocationId)
    : null;

  if (exploration.view === 'select') {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {locations.map((loc) => (
          <Card
            key={loc.id}
            className={`space-y-2 p-4 ${locationStyles[loc.id] ?? ''}`}
          >
            <SectionHeader>{loc.name}</SectionHeader>
            <p>{loc.description}</p>
            <div className="text-sm">
              Enemies: {loc.enemies.map((e) => getEnemyById(e)?.name ?? e).join(', ')}
            </div>
            <div className="text-sm">
              Loot:{' '}
              {loc.lootTable
                ?.map((d) =>
                  d.itemId === 'credits'
                    ? '💰'
                    : getItem(d.itemId)?.iconText ?? d.itemId,
                )
                .join(' ')}
            </div>
            <ButtonNeon onClick={() => setLocation(loc.id)}>Enter</ButtonNeon>
          </Card>
        ))}
      </div>
    );
  }

    return (
      <Card
        className={`space-y-4 p-4 ${
          currentLocation ? locationStyles[currentLocation.id] ?? '' : ''
        }`}
      >
        <SectionHeader>{currentLocation?.name}</SectionHeader>
      <p>{currentLocation?.description}</p>
      <div className="flex gap-4">
        <div className="flex-1 space-y-1 overflow-y-auto border p-2">
          <SectionHeader>Enemies</SectionHeader>
          {currentLocation?.enemies.map((e) => {
            const enemy = getEnemyById(e);
            return (
              <div key={e} className="text-sm">
                {enemy?.name} (HP {enemy?.hp} ATK {enemy?.atk})
              </div>
            );
          })}
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto border p-2">
          <SectionHeader>Loot</SectionHeader>
          {currentLocation?.lootTable?.map((d) => (
            <div key={d.itemId} className="text-sm">
              {d.itemId === 'credits'
                ? `${d.min ?? d.max ?? ''}💰`
                : getItem(d.itemId)?.name ?? d.itemId}
            </div>
          ))}
        </div>
      </div>
      {exploration.view !== 'encounter' && (
        <ButtonNeon
          onClick={() =>
            exploration.currentLocationId &&
            rollExplorationEvent(exploration.currentLocationId)
          }
        >
          Explore
        </ButtonNeon>
      )}
      <div className="space-y-1">
        {exploration.recentLog.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      {exploration.view === 'encounter' && <CombatPanel />}
      <Modal
        open={!!exploration.lastEvent}
        onClose={clearEncounter}
        actions={<ButtonNeon onClick={clearEncounter}>Continue Exploring</ButtonNeon>}
      >
        {exploration.lastEvent?.summary}
      </Modal>
      {exploration.view === 'location' && (
        <ButtonNeon
          onClick={() =>
            useGameStore.setState((s) => ({
              ...s,
              exploration: { ...s.exploration, currentLocationId: null, view: 'select' },
            }))
          }
        >
          Change Location
        </ButtonNeon>
      )}
    </Card>
  );
}
