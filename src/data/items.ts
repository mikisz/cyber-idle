export type Item = {
  id: string;
  name: string;
  type: 'consumable' | 'weapon' | 'armor' | 'upgrade' | 'misc';
  description: string;
  value: number;
  stats?: { attack?: number; defense?: number; hackingSpeed?: number };
  effect?: { heal?: number };
  buyPriceCredits?: number;
  buyPriceData?: number;
  source?: 'shop-only' | 'loot-only' | 'both';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
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
    value: 50,
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
    value: 40,
    source: 'both',
    iconText: '🛡️',
  },
  {
    id: 'medkit_s',
    name: 'Medkit (S)',
    type: 'consumable',
    source: 'shop-only',
    buyPriceCredits: 50,
    value: 25,
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
    value: 60,
    effect: { heal: 120 },
    iconText: '💊',
    description: 'Restores 120 health when used.',
  },
  {
    id: 'scrap_metal',
    name: 'Scrap Metal',
    description: 'Useful junk found in the slums.',
    value: 10,
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
    value: 200,
    source: 'loot-only',
  },
  {
    id: 'neural_chip',
    name: 'Neural Chip',
    description: 'Cybernetic implant that speeds up hacking by 5%.',
    type: 'upgrade',
    source: 'loot-only',
    stats: { hackingSpeed: 1.05 },
    rarity: 'epic',
    iconText: '🔩',
    value: 150,
  },
  {
    id: 'shock_baton',
    name: 'Shock Baton',
    description: 'Electrified baton that delivers a stunning jolt.',
    type: 'weapon',
    source: 'loot-only',
    stats: { attack: 3 },
    rarity: 'rare',
    iconText: '🗡',
    value: 100,
  },
];

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}
