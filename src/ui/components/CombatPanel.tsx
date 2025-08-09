import { getEnemyById } from '../../data/enemies';
import { getItem } from '../../data/items';
import { attack, flee, quickHeal } from '../../game/combat';
import { useGameStore } from '../../game/state/store';
import ButtonNeon from './ButtonNeon';
import ProgressBarNeon from './ProgressBarNeon';

export default function CombatPanel() {
  const combat = useGameStore((s) => s.combat);
  const player = useGameStore((s) => s.player);
  const equipped = useGameStore((s) => s.equipped);
  const enemy = combat.enemyId ? getEnemyById(combat.enemyId) : null;
  const weapon = equipped.weapon ? getItem(equipped.weapon)?.name ?? equipped.weapon : 'None';
  const armor = equipped.armor ? getItem(equipped.armor)?.name ?? equipped.armor : 'None';

  return (
    <div className="space-y-4">
      <div>
        <div>Player HP: {player.hp} / {player.hpMax}</div>
        <ProgressBarNeon
          percentage={(player.hp / player.hpMax) * 100}
          className="mt-1"
        />
        <div className="text-sm">ATK {player.atk} DEF {player.def}</div>
        <div className="text-sm">Weapon: {weapon} / Armor: {armor}</div>
      </div>
      <div>
        <div>
          {enemy?.name} HP: {combat.enemyHp} / {enemy?.hp}
        </div>
        <ProgressBarNeon
          percentage={enemy ? (combat.enemyHp / enemy.hp) * 100 : 0}
          color="magenta"
          className="mt-1"
        />
        <div className="text-sm">ATK {enemy?.atk} DEF {enemy?.def}</div>
        <div className="text-sm">{enemy?.description}</div>
      </div>
      <div className="space-y-1">
        {combat.log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <ButtonNeon onClick={attack}>Attack</ButtonNeon>
        <ButtonNeon onClick={quickHeal}>Use Item</ButtonNeon>
        <ButtonNeon onClick={flee}>Flee</ButtonNeon>
      </div>
    </div>
  );
}
