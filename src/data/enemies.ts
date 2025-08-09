export interface EnemyDrop {
  itemId: string;
  chance: number;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  atk: number;
  possibleDrops: EnemyDrop[];
  creditsDrop?: { min: number; max: number };
  description?: string;
}

export const enemies: Enemy[] = [
  {
    id: 'street_thug',
    name: 'Street Thug',
    hp: 20,
    atk: 3,
    possibleDrops: [{ itemId: 'knife_rusty', chance: 0.2 }],
    creditsDrop: { min: 5, max: 15 },
    description: 'A desperate punk looking for cash.',
  },
  {
    id: 'cyber_rat',
    name: 'Cyber Rat',
    hp: 15,
    atk: 2,
    possibleDrops: [{ itemId: 'medkit_small', chance: 0.05 }],
    creditsDrop: { min: 1, max: 5 },
  },
];

export function getEnemy(id: string): Enemy | undefined {
  return enemies.find((e) => e.id === id);
}
