import { useGameStore } from '../../game/state/store';
import { locations, getLocation } from '../../data/locations';
import { getEnemyById } from '../../data/enemies';
import { getItem } from '../../data/items';
import { setLocation, exploreOnce, clearEncounter } from '../../game/exploration';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import ButtonNeon from '../components/ButtonNeon';
import Modal from '../components/Modal';
import CombatPanel from '../components/CombatPanel';
import { getLootTable } from '../../data/lootTables';

export default function ExplorationTab() {
  const exploration = useGameStore((s) => s.exploration);
  const currentLocation = exploration.currentLocationId
    ? getLocation(exploration.currentLocationId)
    : null;

  if (exploration.view === 'select') {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {locations.map((loc) => {
          const lootTable = getLootTable(loc.id);
          return (
            <Card key={loc.id} className="space-y-2 p-4">
              <SectionHeader>{loc.name}</SectionHeader>
              <p>{loc.description}</p>
              <div className="text-sm">
                Enemies: {loc.enemies.map((e) => getEnemyById(e)?.name ?? e).join(', ')}
              </div>
              <div className="text-sm">
                Loot: {lootTable?.drops
                  .map((d) =>
                    d.itemId === 'credits'
                      ? '💰'
                      : getItem(d.itemId)?.iconText ?? d.itemId,
                  )
                  .join(' ')}
              </div>
              <ButtonNeon onClick={() => setLocation(loc.id)}>Enter</ButtonNeon>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="space-y-4 p-4">
      <SectionHeader>{currentLocation?.name}</SectionHeader>
      <p>{currentLocation?.description}</p>
      {exploration.view !== 'encounter' && (
        <ButtonNeon onClick={() => exploreOnce()}>Explore</ButtonNeon>
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
