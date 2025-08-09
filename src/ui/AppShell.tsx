import { useState } from 'react';
import HackingTab from './tabs/HackingTab';
import CombatTab from './tabs/CombatTab';
import ExplorationTab from './tabs/ExplorationTab';
import InventoryTab from './tabs/InventoryTab';
import StoreTab from './tabs/StoreTab';
import UpgradesTab from './tabs/UpgradesTab';
import CharacterTab from './tabs/CharacterTab';
import SettingsMenu from './SettingsMenu';
import { useGameStore } from '../game/state/store';
import { NeonToast } from './Toast';

export type Tab =
  | 'hacking'
  | 'combat'
  | 'inventory'
  | 'store'
  | 'upgrades'
  | 'character'
  | 'exploration';

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'character', label: 'Character', icon: '👤' },
  { key: 'hacking', label: 'Hacking', icon: '💻' },
  { key: 'exploration', label: 'Exploration', icon: '🧭' },
  { key: 'combat', label: 'Combat', icon: '⚔️' },
  { key: 'inventory', label: 'Inventory', icon: '🎒' },
  { key: 'store', label: 'Store', icon: '🏪' },
  { key: 'upgrades', label: 'Upgrades', icon: '🛠' },
];

export default function AppShell() {
  const [current, setCurrent] = useState<Tab>('hacking');
  const resources = useGameStore((s) => s.resources);
  const skills = useGameStore((s) => s.skills);

  const renderTab = () => {
    switch (current) {
      case 'character':
        return <CharacterTab />;
      case 'combat':
        return <CombatTab onNavigate={setCurrent} />;
      case 'exploration':
        return <ExplorationTab onNavigate={setCurrent} />;
      case 'inventory':
        return <InventoryTab />;
      case 'store':
        return <StoreTab />;
      case 'upgrades':
        return <UpgradesTab />;
      default:
        return <HackingTab />;
    }
  };

  return (
    <div className="flex h-full flex-col bg-surface">
      <NeonToast />
      <header className="flex justify-between p-4 text-neon-cyan">
        <span>Credits: {resources.credits}</span>
        <div className="flex items-center gap-2">
          <span>Data: {resources.data}</span>
          <span className="text-xs">Hacking L{skills.hacking.level}</span>
          <span className="text-xs">Combat L{skills.combat.level}</span>
          <SettingsMenu />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto" data-testid="tab-content">
        {renderTab()}
      </main>
      <nav className="flex justify-around border-t border-neon-magenta p-2 text-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            aria-label={tab.label}
            className={`flex flex-1 items-center justify-center gap-1 p-2 ${
              current === tab.key
                ? 'text-neon-magenta drop-shadow-[0_0_6px_#ff00ff]'
                : 'text-neon-cyan'
            }`}
            onClick={() => setCurrent(tab.key)}
          >
            <span>{tab.icon}</span>
            {current === tab.key && <span>{tab.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
