export interface DropEntry {
  itemId: string;
  dropChance: number; // 0-1
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  atk: number;
  description: string;
  dropTable: DropEntry[];
}

export const enemies: Enemy[] = [
  {
    id: 'street_thug',
    name: 'Street Thug',
    hp: 50,
    atk: 5,
    description: 'A low-level punk looking for trouble.',
    dropTable: [
      { itemId: 'small_credchip', dropChance: 0.6 },
      { itemId: 'medkit', dropChance: 0.2 },
    ],
  },
  {
    id: 'data_leech',
    name: 'Data Leech',
    hp: 40,
    atk: 8,
    description: 'A scavenger that feeds on unsecured data.',
    dropTable: [
      { itemId: 'small_credchip', dropChance: 0.5 },
      { itemId: 'energy_cell', dropChance: 0.15 },
    ],
  },
  {
    id: 'cyber_bruiser',
    name: 'Cyber Bruiser',
    hp: 70,
    atk: 10,
    description: 'Heavily augmented street fighter.',
    dropTable: [
      { itemId: 'small_credchip', dropChance: 0.3 },
      { itemId: 'medkit', dropChance: 0.25 },
    ],
  },
  {
    id: 'rogue_drone',
    name: 'Rogue Drone',
    hp: 60,
    atk: 9,
    description: 'Autonomous drone gone haywire.',
    dropTable: [
      { itemId: 'energy_cell', dropChance: 0.3 },
      { itemId: 'small_credchip', dropChance: 0.4 },
    ],
  },
  {
    id: 'netrunner',
    name: 'Netrunner',
    hp: 45,
    atk: 7,
    description: 'A hacker defending their turf.',
    dropTable: [
      { itemId: 'large_credchip', dropChance: 0.4 },
      { itemId: 'data_fragment', dropChance: 0.2 },
    ],
  },
  {
    id: 'ice_program',
    name: 'ICE Program',
    hp: 55,
    atk: 9,
    description: 'Defensive security algorithm made manifest.',
    dropTable: [
      { itemId: 'data_fragment', dropChance: 0.25 },
      { itemId: 'energy_cell', dropChance: 0.2 },
    ],
  },
];

export function getEnemy(id: string): Enemy | undefined {
  return enemies.find((e) => e.id === id);
}
