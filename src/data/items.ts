export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable';
  source: 'loot-only' | 'shop-only' | 'both';
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic';
  description?: string;
  iconText?: string; // placeholder symbol
  stats?: { atk?: number; hpMax?: number; hackingSpeed?: number };
  effect?: { heal?: number };
  priceCredits?: number;
}

export const items: Item[] = [
  {
    id: 'knife_rusty',
    name: 'Rusty Knife',
    type: 'weapon',
    source: 'loot-only',
    stats: { atk: 2 },
    rarity: 'common',
    iconText: '🗡',
  },
  {
    id: 'medkit_small',
    name: 'Medkit (S)',
    type: 'consumable',
    source: 'shop-only',
    effect: { heal: 50 },
    priceCredits: 50,
    iconText: '💊',
  },
  {
    id: 'jacket_leather',
    name: 'Leather Jacket',
    type: 'armor',
    source: 'both',
    stats: { hpMax: 10 },
    rarity: 'uncommon',
    iconText: '🛡',
  },
  {
    id: 'ring_data',
    name: 'Data Ring',
    type: 'accessory',
    source: 'loot-only',
    stats: { hackingSpeed: 0.05 },
    rarity: 'rare',
    iconText: '💍',
  },
];

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}
