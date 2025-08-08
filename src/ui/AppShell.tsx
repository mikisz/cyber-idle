import { useState } from 'react';
import HackingTab from './tabs/HackingTab';
import CombatTab from './tabs/CombatTab';
import InventoryTab from './tabs/InventoryTab';
import UpgradesTab from './tabs/UpgradesTab';

type Tab = 'hacking' | 'combat' | 'inventory' | 'upgrades';

const tabs: { key: Tab; label: string }[] = [
  { key: 'hacking', label: 'Hacking' },
  { key: 'combat', label: 'Combat' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'upgrades', label: 'Upgrades' }
];

export default function AppShell() {
  const [current, setCurrent] = useState<Tab>('hacking');

  const renderTab = () => {
    switch (current) {
      case 'combat':
        return <CombatTab />;
      case 'inventory':
        return <InventoryTab />;
      case 'upgrades':
        return <UpgradesTab />;
      default:
        return <HackingTab />;
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex justify-between p-4 text-neon-cyan">
        <span>Credits: 0</span>
        <span>Data: 0</span>
      </header>
      <main className="flex-1 overflow-y-auto" data-testid="tab-content">
        {renderTab()}
      </main>
      <nav className="flex justify-around border-t border-neon-magenta p-2 text-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 p-2 ${
              current === tab.key
                ? 'text-neon-magenta drop-shadow-[0_0_6px_#ff00ff]'
                : 'text-neon-cyan'
            }`}
            onClick={() => setCurrent(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
