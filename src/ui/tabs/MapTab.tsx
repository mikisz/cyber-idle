import { useState } from 'react';
import { districts, type DistrictStatus } from '../../data/world';
import { getEnemyById } from '../../data/enemies';
import { useGameStore, setActiveDistrict } from '../../game/state/store';
import { showToast } from '../Toast';
import LocationView from './LocationView';

export default function MapTab() {
  const playerLevel = useGameStore((s) => s.playerLevel);
  const activeDistrictId = useGameStore((s) => s.world.activeDistrictId);
  const [view, setView] = useState<'map' | 'location'>('map');

  if (view === 'location' && activeDistrictId) {
    return <LocationView onBack={() => setView('map')} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
      {districts.map((d) => {
        const status: DistrictStatus =
          activeDistrictId === d.id
            ? 'active'
            : playerLevel >= d.unlockLevel
              ? 'available'
              : 'locked';

        const handleClick = () => {
          if (status === 'locked') {
            showToast(`Requires Level ${d.unlockLevel}`);
          } else {
            setActiveDistrict(d.id);
            setView('location');
          }
        };

        return (
          <div
            key={d.id}
            onClick={handleClick}
            className={`group relative cursor-pointer border p-4 transition ${
              status === 'locked'
                ? 'opacity-50'
                : 'hover:shadow-[0_0_8px_#ff00ff]'
            } ${
              status === 'active'
                ? 'border-neon-magenta animate-pulse'
                : status === 'available'
                  ? 'border-neon-cyan'
                  : 'border-gray-700'
            }`}
          >
            {status === 'locked' && (
              <span className="absolute right-2 top-2">🔒</span>
            )}
            <div className="font-bold">{d.name}</div>
            <div className="text-sm">{d.description}</div>
            {status === 'locked' && (
              <div className="mt-2 text-xs">Requires L{d.unlockLevel}</div>
            )}
            {d.enemies && (
              <div className="mt-1 text-xs">
                Enemies:{' '}
                {d.enemies
                  .map((e) => getEnemyById(e)?.name ?? e)
                  .join(', ')}
              </div>
            )}
            {d.actions.some((a) => a.iconText) && (
              <div className="mt-1 text-lg">
                {d.actions
                  .map((a) => a.iconText)
                  .filter(Boolean)
                  .join(' ')}
              </div>
            )}
            <div className="pointer-events-none absolute left-1/2 top-full z-10 hidden w-48 -translate-x-1/2 rounded border border-neon-magenta bg-surface p-2 text-xs group-hover:block">
              <div className="font-bold">{d.name}</div>
              <p className="mb-1">{d.description}</p>
              <div>Requires L{d.unlockLevel}</div>
              {d.actions.some((a) => a.iconText) && (
                <div className="mt-1">
                  {d.actions
                    .map((a) => a.iconText)
                    .filter(Boolean)
                    .join(' ')}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
