import { districts } from '../../data/world';
import { useGameStore, setActiveDistrict } from '../../game/state/store';
import { showToast } from '../Toast';
import LocationView from '../location/LocationView';

const districtPositions: Record<string, { x: number; y: number }> = {
  neon_market: { x: 30, y: 60 },
  back_alley: { x: 55, y: 45 },
  skyline_plaza: { x: 75, y: 30 },
};

export default function MapTab() {
  const playerLevel = useGameStore((s) => s.playerLevel);
  const activeDistrictId = useGameStore((s) => s.world.activeDistrictId);

  if (activeDistrictId) {
    return <LocationView />;
  }

  return (
    <div
      className="relative h-full w-full bg-center bg-cover"
      style={{ backgroundImage: 'url(/world-map.svg)' }}
    >
      {districts.map((d) => {
        const pos = districtPositions[d.id];
        if (!pos) return null;
        const status =
          playerLevel >= d.unlockLevel ? 'available' : 'locked';
        const handleClick = () => {
          if (status === 'locked') {
            showToast(`Requires Level ${d.unlockLevel}`);
          } else {
            setActiveDistrict(d.id);
          }
        };
        return (
          <div
            key={d.id}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <button
              onClick={handleClick}
              className={`h-6 w-6 rounded-full border-2 ${
                status === 'locked'
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-neon-cyan bg-gray-900 hover:shadow-[0_0_8px_#0ff]'
              }`}
            >
              {status === 'locked' && <span className="text-xs">🔒</span>}
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full z-10 hidden w-40 -translate-x-1/2 rounded border border-neon-magenta bg-surface p-2 text-xs group-hover:block">
              <div className="font-bold">{d.name}</div>
              <p className="mb-1">{d.description}</p>
              <div>Requires L{d.unlockLevel}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
