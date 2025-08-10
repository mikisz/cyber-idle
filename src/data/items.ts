export type Item = {
  id: string;
  name: string;
  type: 'consumable' | 'weapon' | 'armor' | 'accessory' | 'misc';
  description?: string;
  stats?: { attack?: number; defense?: number; hackingSpeed?: number };
  effect?: { heal?: number };
  buyPriceCredits?: number;
  buyPriceData?: number;
  source?: 'shop-only' | 'loot-only' | 'both';
  rarity?: 'common' | 'uncommon' | 'rare';
  iconText?: string;
};

export const items: Item[] = [
  {
    id: 'basic_sword',
    name: 'Basic Sword',
    description: 'A simple blade that boosts attack.',
    type: 'weapon',
    stats: { attack: 5 },
    buyPriceCredits: 50,
    source: 'both',
    iconText: '🗡️',
  },
  {
    id: 'leather_armor',
    name: 'Leather Armor',
    description: 'Light armor offering minimal protection.',
    type: 'armor',
    stats: { defense: 3 },
    buyPriceCredits: 40,
    source: 'both',
    iconText: '🛡️',
  },
  {
    id: 'medkit_s',
    name: 'Medkit (S)',
    type: 'consumable',
    source: 'shop-only',
    buyPriceCredits: 50,
    effect: { heal: 50 },
    iconText: '💊',
    description: 'Restores 50 health when used.',
  },
  {
    id: 'medkit_m',
    name: 'Medkit (M)',
    type: 'consumable',
    source: 'shop-only',
    buyPriceData: 25,
    effect: { heal: 120 },
    iconText: '💊',
    description: 'Restores 120 health when used.',
  },
  {
    id: 'scrap_metal',
    name: 'Scrap Metal',
    description: 'Useful junk found in the slums.',
    type: 'misc',
    source: 'loot-only',
  },
  {
    id: 'rare_blade',
    name: 'Rare Blade',
    description: 'An exceptionally crafted weapon.',
    type: 'weapon',
    stats: { attack: 15 },
    buyPriceCredits: 200,
    source: 'loot-only',
  },
  {
    id: 'neural_chip',
    name: 'Neural Chip',
    type: 'accessory',
    source: 'loot-only',
    stats: { hackingSpeed: 1.05 },
    rarity: 'rare',
    iconText: '🔩',
  },
  {
    id: 'shock_baton',
    name: 'Shock Baton',
    type: 'weapon',
    source: 'loot-only',
    stats: { attack: 3 },
    rarity: 'uncommon',
    iconText: '🗡',
  },
];

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}
