import { upgrades } from '../../data/upgrades';
import { useGameStore } from '../../game/state/store';
import { buyUpgrade } from '../../game/shop';
import { showToast } from '../Toast';
import Card from '../components/Card';
import ButtonNeon from '../components/ButtonNeon';
import SectionHeader from '../components/SectionHeader';

export default function UpgradesTab() {
  const resources = useGameStore((s) => s.resources);
  const owned = useGameStore((s) => s.upgrades.owned);

  const canAfford = (u: typeof upgrades[number]) =>
    resources.credits >= u.costCredits &&
    (u.costData ? resources.data >= u.costData : true);

  const buy = (id: string, name: string) => {
    const success = buyUpgrade(id);
    if (success) showToast(`Installed: ${name}`);
  };

  const effectSummary = (u: typeof upgrades[number]) => {
    const parts: string[] = [];
    if (u.effects.hackingSpeed)
      parts.push(`Hack x${u.effects.hackingSpeed.toFixed(2)}`);
    if (u.effects.atk) parts.push(`ATK +${u.effects.atk}`);
    if (u.effects.hpMax) parts.push(`HP +${u.effects.hpMax}`);
    return parts.join(', ');
  };

  return (
    <Card className="space-y-4 p-4">
      <SectionHeader>Upgrades</SectionHeader>
      <p className="text-sm text-neon-cyan">
        Upgrades are permanent and automatically applied.
      </p>
      <ul className="space-y-2">
        {upgrades.map((u) => {
          const isOwned = owned[u.id];
          const disabled = isOwned || !canAfford(u);
          return (
            <li key={u.id} className="flex items-center justify-between">
              <div>
                <div>
                  {u.iconText} {u.name}
                </div>
                <div className="text-sm text-neon-cyan">{effectSummary(u)}</div>
                <div className="text-sm text-neon-cyan">
                  Credits: {u.costCredits}
                </div>
                {u.costData !== undefined && (
                  <div className="text-sm text-neon-cyan">Data: {u.costData}</div>
                )}
              </div>
              <ButtonNeon
                data-testid={`buy-${u.id}`}
                onClick={() => buy(u.id, u.name)}
                disabled={disabled}
              >
                {isOwned ? 'Owned' : 'Buy'}
              </ButtonNeon>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
