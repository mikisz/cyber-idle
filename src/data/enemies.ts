export interface Enemy {
  id: string;
  name: string;
  hp: number;
  atk: number;
  creditsDrop?: { min: number; max: number };
  description?: string;
}

export const enemies: Enemy[] = [
  {
    id: 'street_thug',
    name: 'Street Thug',
    hp: 20,
    atk: 3,
    creditsDrop: { min: 5, max: 15 },
    description: 'A desperate punk looking for cash.',
  },
  {
    id: 'cyber_rat',
    name: 'Cyber Rat',
    hp: 15,
    atk: 2,
    creditsDrop: { min: 1, max: 5 },
  },
];

export const getEnemyById = (id: string): Enemy | undefined =>
  enemies.find((e) => e.id === id);
