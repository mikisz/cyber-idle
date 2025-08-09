import { upgrades, type Upgrade } from '../../data/upgrades';
import { useGameStore } from '../../game/state/store';
import { showToast } from '../Toast';

export default function UpgradesTab() {
  const player = useGameStore((s) => s.player);
  const owned = useGameStore((s) => s.upgrades.owned);
  const setState = useGameStore.setState;

  const canAfford = (u: Upgrade) => {
    if (u.costCredits && player.credits < u.costCredits) return false;
    return true;
  };

  const buy = (u: Upgrade) => {
    setState((state) => {
      if (state.upgrades.owned[u.id]) return state;
      if (!canAfford(u)) return state;
      const newPlayer = { ...state.player };
      if (u.costCredits) newPlayer.credits -= u.costCredits;
      if (u.effects.atk) newPlayer.atk += u.effects.atk;
      if (u.effects.hpMax) {
        newPlayer.hpMax += u.effects.hpMax;
        newPlayer.hp = newPlayer.hpMax;
      }
      const newHacking = { ...state.hacking };
      if (u.effects.hackingSpeed) {
        newHacking.timeMultiplier *= u.effects.hackingSpeed;
      }
      return {
        ...state,
        player: newPlayer,
        hacking: newHacking,
        upgrades: {
          owned: { ...state.upgrades.owned, [u.id]: true },
        },
      };
    });
    showToast(`Purchased: ${u.name}`);
  };

  return (
    <div className="space-y-4 p-4">
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
                <div>{u.name}</div>
                <div className="text-sm text-neon-cyan">
                  {u.costCredits ? `Credits: ${u.costCredits} ` : ''}
                </div>
              </div>
              <button
                data-testid={`buy-${u.id}`}
                onClick={() => buy(u)}
                disabled={disabled}
              >
                {isOwned ? 'Owned' : 'Buy'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
