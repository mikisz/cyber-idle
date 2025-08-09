import { useEffect, useState } from 'react';
import { attack, flee, quickHeal, startCombat } from '../../game/combat';
import { enemies, getEnemyById } from '../../data/enemies';
import { useGameStore } from '../../game/state/store';
import type { Tab } from '../AppShell';
import Card from '../components/Card';
import ButtonNeon from '../components/ButtonNeon';
import ProgressBarNeon from '../components/ProgressBarNeon';
import SectionHeader from '../components/SectionHeader';
import Modal from '../components/Modal';

interface Props {
  onNavigate?: (tab: Tab) => void;
}

export default function CombatTab({ onNavigate }: Props) {
  const combat = useGameStore((s) => s.combat);
  const player = useGameStore((s) => s.player);
  const [selected, setSelected] = useState(enemies[0]?.id ?? '');
  const [result, setResult] = useState<string | null>(null);

  const enemy = combat.enemyId ? getEnemyById(combat.enemyId) : null;

  useEffect(() => {
    if (!combat.inFight && combat.log.length > 0) {
      const last = combat.log[combat.log.length - 1];
      if (last.includes('Defeated') || last.includes('defeated')) {
        setResult(last);
      }
    }
  }, [combat.inFight, combat.log]);

  return (
    <Card className="space-y-4 p-4">
      <SectionHeader>Combat</SectionHeader>
      {!combat.inFight ? (
        <div className="space-y-4">
          <div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="bg-black"
            >
              {enemies.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <ButtonNeon onClick={() => startCombat(selected)} disabled={!selected}>
            Engage
          </ButtonNeon>
          <ButtonNeon onClick={quickHeal}>Quick Heal</ButtonNeon>
          {combat.fromExploration && (
            <ButtonNeon
              onClick={() => {
                useGameStore.setState((s) => ({
                  ...s,
                  combat: { ...s.combat, fromExploration: false },
                }));
                onNavigate?.('exploration');
              }}
            >
              Continue Exploring
            </ButtonNeon>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            Player HP: {player.hp} / {player.hpMax}
            <ProgressBarNeon
              percentage={(player.hp / player.hpMax) * 100}
              className="mt-1"
            />
          </div>
          <div>
            {enemy?.name} HP: {combat.enemyHp} / {enemy?.hp}
            <ProgressBarNeon
              percentage={enemy ? (combat.enemyHp / enemy.hp) * 100 : 0}
              color="magenta"
              className="mt-1"
            />
          </div>
          <div className="space-y-1">
            {combat.log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <ButtonNeon onClick={attack}>Attack</ButtonNeon>
            <ButtonNeon onClick={flee}>Flee</ButtonNeon>
            <ButtonNeon onClick={quickHeal}>Quick Heal</ButtonNeon>
          </div>
        </div>
      )}
      <Modal open={!!result} onClose={() => setResult(null)}>
        {result}
      </Modal>
    </Card>
  );
}
