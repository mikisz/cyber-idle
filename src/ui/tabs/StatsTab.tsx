import { useGameStore } from '../../game/state/store';
import { getNextLevelXp } from '../../game/skills';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import ProgressBarNeon from '../components/ProgressBarNeon';

export default function StatsTab() {
  const player = useGameStore((s) => s.player);
  const playerLevel = useGameStore((s) => s.playerLevel);
  const playerXP = useGameStore((s) => s.playerXP);
  const playerXPToNext = useGameStore((s) => s.playerXPToNextLevel);
  const skills = useGameStore((s) => s.skills);
  const bonuses = useGameStore((s) => s.bonuses);

  const renderSkill = (
    name: string,
    data: { level: number; xp: number },
  ) => {
    const next = getNextLevelXp(data.level);
    return (
      <div className="space-y-1">
        <div>
          {name} — Level {data.level}
        </div>
        <ProgressBarNeon
          percentage={(data.xp / next) * 100}
          color="magenta"
        />
      </div>
    );
  };

  return (
    <Card className="space-y-4 p-4">
      <div>
        <SectionHeader>Player Level</SectionHeader>
        <div>Level {playerLevel}</div>
        <ProgressBarNeon
          percentage={(playerXP / playerXPToNext) * 100}
          color="cyan"
        />
      </div>
      <div>
        <SectionHeader>Core Stats</SectionHeader>
        <div>HP: {player.hp}/{player.hpMax}</div>
        <div>ATK: {player.atk}</div>
        <div>DEF: {player.def}</div>
      </div>
      <div className="space-y-2">
        <SectionHeader>Skills</SectionHeader>
        {renderSkill('Combat', skills.combat)}
        {renderSkill('Hacking', skills.hacking)}
        {renderSkill('Exploration', skills.exploration)}
      </div>
      <div>
        <SectionHeader>Equipment Bonuses</SectionHeader>
        <div>Damage: +{bonuses.damage}</div>
        <div>Defense: +{bonuses.defense}</div>
        <div>
          Hacking Speed: +{Math.round((bonuses.hackingSpeed - 1) * 100)}%
        </div>
        <div>Exploration Success: +{bonuses.exploration}%</div>
      </div>
    </Card>
  );
}
