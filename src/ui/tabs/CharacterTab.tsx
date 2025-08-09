import { useGameStore } from '../../game/state/store';
import { getItem } from '../../data/items';
import { getUpgrade } from '../../data/upgrades';
import { getNextLevelXp } from '../../game/skills';

export default function CharacterTab() {
  const resources = useGameStore((s) => s.resources);
  const player = useGameStore((s) => s.player);
  const skills = useGameStore((s) => s.skills);
  const equipped = useGameStore((s) => s.equipped);
  const owned = useGameStore((s) => s.upgrades.owned);

  const effects: string[] = [];
  for (const slot of Object.keys(equipped) as (keyof typeof equipped)[]) {
    const id = equipped[slot];
    if (id) {
      const item = getItem(id);
      if (item?.stats?.attack)
        effects.push(`+${item.stats.attack} ATK from ${item.name}`);
      if (item?.stats?.defense)
        effects.push(`+${item.stats.defense} DEF from ${item.name}`);
    }
  }
  for (const id of Object.keys(owned)) {
    if (!owned[id]) continue;
    const up = getUpgrade(id);
    if (!up) continue;
    if (up.effects.atk) effects.push(`+${up.effects.atk} ATK from ${up.name}`);
    if (up.effects.hpMax)
      effects.push(`+${up.effects.hpMax} HP from ${up.name}`);
    if (up.effects.hackingSpeed)
      effects.push(
        `+${Math.round((up.effects.hackingSpeed - 1) * 100)}% Hacking Speed from ${up.name}`,
      );
  }

  const hackingNext = getNextLevelXp(skills.hacking.level);
  const combatNext = getNextLevelXp(skills.combat.level);

  const renderSkill = (
    name: string,
    data: { level: number; xp: number },
    next: number,
  ) => (
    <div className="space-y-1">
      <div>
        {name}: Level {data.level} ({data.xp}/{next})
      </div>
      <div className="h-2 w-full bg-gray-800">
        <div
          className="h-full bg-neon-magenta"
          style={{ width: `${(data.xp / next) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4 p-4">
      <div className="border border-neon-cyan p-2">
        <div className="font-bold">Summary</div>
        <div>Credits: {resources.credits}</div>
        <div>Data: {resources.data}</div>
      </div>
      <div className="border border-neon-cyan p-2">
        <div className="font-bold">Core Stats</div>
        <div>HP: {player.hp}/{player.hpMax}</div>
        <div>ATK: {player.atk}</div>
        <div>DEF: {player.def}</div>
      </div>
      <div className="border border-neon-cyan p-2 space-y-2">
        <div className="font-bold">Skills</div>
        {renderSkill('Hacking', skills.hacking, hackingNext)}
        {renderSkill('Combat', skills.combat, combatNext)}
      </div>
      <div className="border border-neon-cyan p-2">
        <div className="font-bold">Effects</div>
        {effects.length === 0 ? (
          <div>None</div>
        ) : (
          <ul className="list-disc pl-4">
            {effects.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
