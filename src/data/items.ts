import type { Stats, Effect } from '../types/stats';

export type ItemType = 'weapon' | 'armor' | 'consumable' | 'upgrade' | 'misc';

export type Item = {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  value: number;
  stats?: Stats;
  effect?: Effect;
  source?: 'shop-only' | 'loot-only' | 'both';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
};

export const ITEM_TYPE_ICONS: Record<ItemType, string> = {
  weapon: '🗡️',
  armor: '🛡️',
  consumable: '💊',
  upgrade: '⚙️',
  misc: '📦',
};

export const items: Item[] = [
  {
    id: 'basic_sword',
    name: 'Basic Sword',
    type: 'weapon',
    description: 'A simple blade that boosts attack.',
    value: 50,
    stats: { atk: 5 },
    source: 'both',
    rarity: 'common',
  },
  {
    id: 'leather_armor',
    name: 'Leather Armor',
    type: 'armor',
    description: 'Light armor offering minimal protection.',
    value: 40,
    stats: { def: 3 },
    source: 'both',
    rarity: 'common',
  },
  {
    id: 'medkit_s',
    name: 'Medkit (S)',
    type: 'consumable',
    description: 'Restores 50 health when used.',
    value: 50,
    effect: { heal: 50 },
    source: 'shop-only',
    rarity: 'common',
  },
  {
    id: 'medkit_m',
    name: 'Medkit (M)',
    type: 'consumable',
    description: 'Restores 120 health when used.',
    value: 100,
    effect: { heal: 120 },
    source: 'shop-only',
    rarity: 'common',
  },
  {
    id: 'scrap_metal',
    name: 'Scrap Metal',
    type: 'misc',
    description: 'Useful junk found in the slums.',
    value: 5,
    source: 'loot-only',
    rarity: 'common',
  },
  {
    id: 'rare_blade',
    name: 'Rare Blade',
    type: 'weapon',
    description: 'An exceptionally crafted weapon.',
    value: 200,
    stats: { atk: 15 },
    source: 'loot-only',
    rarity: 'epic',
  },
  {
    id: 'neural_chip',
    name: 'Neural Chip',
    type: 'upgrade',
    description: 'Enhances neural processing speed.',
    value: 150,
    stats: { hackingSpeed: 1.05 },
    source: 'loot-only',
    rarity: 'rare',
  },
  {
    id: 'shock_baton',
    name: 'Shock Baton',
    type: 'weapon',
    description: 'Stuns enemies with an electric charge.',
    value: 120,
    stats: { atk: 3 },
    source: 'loot-only',
    rarity: 'rare',
  },
];

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}
