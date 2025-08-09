export type Item = {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'misc';
  stats?: { attack?: number; defense?: number; heal?: number };
  sellPrice?: number;
  buyPrice?: number;
  isPurchasable?: boolean; // true for store items, false for loot-only
};

export const items: Item[] = [
  {
    id: 'basic_sword',
    name: 'Basic Sword',
    description: 'A simple blade that boosts attack.',
    type: 'weapon',
    stats: { attack: 5 },
    sellPrice: 25,
    buyPrice: 50,
    isPurchasable: true,
  },
  {
    id: 'leather_armor',
    name: 'Leather Armor',
    description: 'Light armor offering minimal protection.',
    type: 'armor',
    stats: { defense: 3 },
    sellPrice: 20,
    buyPrice: 40,
    isPurchasable: true,
  },
  {
    id: 'medkit',
    name: 'Medkit',
    description: 'Restores 50 health when used.',
    type: 'consumable',
    stats: { heal: 50 },
    sellPrice: 10,
    buyPrice: 20,
    isPurchasable: true,
  },
  {
    id: 'scrap_metal',
    name: 'Scrap Metal',
    description: 'Useful junk found in the slums.',
    type: 'misc',
    isPurchasable: false,
  },
  {
    id: 'rare_blade',
    name: 'Rare Blade',
    description: 'An exceptionally crafted weapon.',
    type: 'weapon',
    stats: { attack: 15 },
    sellPrice: 100,
    buyPrice: 200,
    isPurchasable: false,
  },
];

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

