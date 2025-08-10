import { useEffect, useState } from 'react';
import {
  useGameStore,
  getDistrictById,
  setActiveDistrict,
} from '../../game/state/store';
import {
  startDistrictAction,
  stopDistrictAction,
  getDistrictActionDuration,
} from '../../game/district';
import ButtonNeon from '../components/ButtonNeon';
import Card from '../components/Card';
import ProgressBarNeon from '../components/ProgressBarNeon';
import { ITEM_TYPE_ICONS, getItem } from '../../data/items';

const localTabs = [
  { key: 'missions', label: 'Misje' },
  { key: 'combat', label: 'Walka' },
  { key: 'hacking', label: 'Hakowanie' },
  { key: 'special', label: 'Special' },
] as const;

type LocalTab = (typeof localTabs)[number]['key'];

export default function LocationView() {
  const activeDistrictId = useGameStore((s) => s.world.activeDistrictId);
  const runtime = useGameStore((s) => s.districtRuntime);
  const state = useGameStore();
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState<LocalTab>('missions');

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const district = activeDistrictId ? getDistrictById(activeDistrictId) : null;
  if (!district) return null;

  const handleBack = () => {
    stopDistrictAction();
    setActiveDistrict(null);
  };

  const filtered = district.actions.filter((a) => {
    if (tab === 'missions') return true;
    if (tab === 'special') return a.kind === 'scavenge';
    return a.kind === tab;
  });

  return (
    <div className="flex h-full">
      {/* Side tabs on desktop */}
      <nav className="hidden w-32 flex-col border-r border-neon-magenta p-2 md:flex">
        {localTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`p-2 text-left ${
              tab === t.key ? 'text-neon-magenta' : 'text-neon-cyan'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button onClick={handleBack} className="text-neon-cyan">
            ←
          </button>
          <span>Mapa &gt; {district.name}</span>
        </div>
        {/* Tabs for mobile */}
        <div className="flex gap-2 md:hidden">
          {localTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 p-2 text-sm ${
                tab === t.key ? 'text-neon-magenta' : 'text-neon-cyan'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p>{district.description}</p>
        <div className="grid gap-2">
          {filtered.map((a) => {
            const running =
              runtime.isRunning && runtime.runningActionId === a.id;
            const duration = getDistrictActionDuration(a, state);
            const progress =
              running && runtime.startedAt
                ? Math.min(100, ((now - runtime.startedAt) / duration) * 100)
                : 0;
            return (
              <Card key={a.id} className="p-2 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">
                      {a.iconText && <span className="mr-1">{a.iconText}</span>}
                      {a.name}
                    </div>
                    <div className="text-xs">
                      {a.kind} · L{a.minLevel} · {(duration / 1000).toFixed(1)}s
                    </div>
                  </div>
                  {running ? (
                    <ButtonNeon onClick={stopDistrictAction}>Stop</ButtonNeon>
                  ) : (
                    <ButtonNeon onClick={() => startDistrictAction(a.id)}>
                      Start
                    </ButtonNeon>
                  )}
                </div>
                {running && <ProgressBarNeon percentage={progress} />}
                {a.loot && (
                  <div className="flex gap-1 text-sm">
                    {a.loot.map((l) => {
                      const item = getItem(l.itemId);
                      return (
                        <span
                          key={l.itemId}
                          title={`${item?.name ?? l.itemId} (${Math.round(
                            l.chance * 100
                          )}%)`}
                        >
                          {item ? ITEM_TYPE_ICONS[item.type] : '🎁'}
                        </span>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
