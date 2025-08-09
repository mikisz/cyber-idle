export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  stats?: {
    atk?: number;
    hpMax?: number;
    hackingSpeed?: number; // percentage as decimal (0.1 = 10%)
  };
  rarity: 'common' | 'uncommon' | 'rare';
  description: string;
}

export const items: Item[] = [
  {
    id: 'shock_baton',
    name: 'Shock Baton',
    type: 'weapon',
    stats: { atk: 5 },
    rarity: 'common',
    description: '+5 ATK',
  },
  {
    id: 'kevlar_jacket',
    name: 'Kevlar Jacket',
    type: 'armor',
    stats: { hpMax: 20 },
    rarity: 'uncommon',
    description: '+20 Max HP',
  },
  {
    id: 'neural_chip',
    name: 'Neural Chip',
    type: 'accessory',
    stats: { hackingSpeed: 0.1 },
    rarity: 'rare',
    description: '+10% hacking speed',
  },
  {
    id: 'medkit',
    name: 'Medkit',
    type: 'consumable',
    rarity: 'common',
    description: 'Heals 50 HP',
  },
];

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}
