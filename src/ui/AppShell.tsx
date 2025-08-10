import { useState } from 'react';
import MapTab from './tabs/MapTab';
import InventoryTab from './tabs/InventoryTab';
import StoreTab from './tabs/StoreTab';
import { useGameStore, getDistrictById } from '../game/state/store';
import ActiveActionBar from './components/ActiveActionBar';

function Placeholder({ name }: { name: string }) {
  return <div className="p-4 text-neon-cyan">{name} - coming soon</div>;
}

export type Tab =
  | 'map'
  | 'inventory'
  | 'implants'
  | 'factions'
  | 'contracts'
  | 'store'
  | 'bank'
  | 'settings';

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'map', label: 'Mapa', icon: '🗺️' },
  { key: 'inventory', label: 'Ekwipunek', icon: '🎒' },
  { key: 'implants', label: 'Implanty', icon: '🧠' },
  { key: 'factions', label: 'Frakcje', icon: '👥' },
  { key: 'contracts', label: 'Kontrakty', icon: '📜' },
  { key: 'store', label: 'Sklep', icon: '🏪' },
  { key: 'bank', label: 'Bank', icon: '🏦' },
  { key: 'settings', label: 'Ustawienia', icon: '⚙️' },
];

export default function AppShell() {
  const [current, setCurrent] = useState<Tab>('map');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const resources = useGameStore((s) => s.resources);
  const activeDistrictId = useGameStore((s) => s.world.activeDistrictId);

  const districtName = activeDistrictId
    ? getDistrictById(activeDistrictId)?.name
    : null;
  const breadcrumb =
    current === 'map'
      ? districtName
        ? `Mapa > ${districtName}`
        : 'Mapa'
      : tabs.find((t) => t.key === current)?.label;

  const renderTab = () => {
    switch (current) {
      case 'map':
        return <MapTab />;
      case 'inventory':
        return <InventoryTab />;
      case 'store':
        return <StoreTab />;
      default:
        return <Placeholder name={tabs.find((t) => t.key === current)?.label ?? ''} />;
    }
  };

  const sidebarButtons = (
    <div className="flex h-full flex-col">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          aria-label={tab.label}
          onClick={() => {
            setCurrent(tab.key);
            setMobileNavOpen(false);
          }}
          className={`group relative flex items-center justify-center p-4 ${
            current === tab.key
              ? 'text-neon-magenta'
              : 'text-neon-cyan'
          }`}
        >
          <span>{tab.icon}</span>
          <span className="absolute left-full ml-2 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs group-hover:block">
            {tab.label}
          </span>
        </button>
      ))}
      <div className="mt-auto p-2 text-xs text-center text-neon-cyan">
        Cr {resources.credits} / Data {resources.data}
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden w-20 border-r border-neon-magenta md:block">
        {sidebarButtons}
      </aside>
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-neon-magenta p-2 md:hidden">
          <span className="text-neon-cyan">{breadcrumb}</span>
          <button
            className="text-neon-cyan"
            onClick={() => setMobileNavOpen(true)}
          >
            ☰
          </button>
        </header>
        <main className="flex-1 overflow-y-auto pb-32 md:pb-0">
          {renderTab()}
        </main>
      </div>
      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            className="absolute bottom-0 top-0 w-40 bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarButtons}
          </div>
        </div>
      )}
      {/* Bottom nav for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-neon-magenta bg-surface p-2 text-lg">
        {['map', 'inventory', 'contracts'].map((key) => {
          const tab = tabs.find((t) => t.key === key as Tab)!;
          return (
            <button
              key={tab.key}
              onClick={() => setCurrent(tab.key)}
              className={
                current === tab.key
                  ? 'text-neon-magenta'
                  : 'text-neon-cyan'
              }
            >
              {tab.icon}
            </button>
          );
        })}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="text-neon-cyan"
        >
          ☰
        </button>
      </nav>
      <ActiveActionBar />
    </div>
  );
}
