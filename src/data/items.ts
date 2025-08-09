export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'currency' | 'quest';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: 'common' | 'uncommon' | 'rare';
  source: 'loot-only' | 'shop-only' | 'both';
  effect?: {
    hp?: number; // amount of HP to heal
    energy?: number; // future use
  };
  value?: number; // credit value for currency items
  description?: string;
}

export const items: Item[] = [
  {
    id: 'medkit',
    name: 'Medkit',
    type: 'consumable',
    rarity: 'common',
    source: 'loot-only',
    effect: { hp: 50 },
    description: 'Heals 50 HP',
  },
  {
    id: 'small_credchip',
    name: 'Small Credchip',
    type: 'currency',
    rarity: 'common',
    source: 'loot-only',
    value: 100,
    description: 'A small cache of credits worth 100',
  },
  {
    id: 'energy_cell',
    name: 'Energy Cell',
    type: 'consumable',
    rarity: 'common',
    source: 'both',
    effect: { hp: 30, energy: 10 },
    description: 'Heals 30 HP and restores 10 energy',
  },
  {
    id: 'large_credchip',
    name: 'Large Credchip',
    type: 'currency',
    rarity: 'uncommon',
    source: 'loot-only',
    value: 500,
    description: 'Valuable credit cache worth 500',
  },
  {
    id: 'data_fragment',
    name: 'Data Fragment',
    type: 'quest',
    rarity: 'rare',
    source: 'loot-only',
    description: 'Encrypted data needed for missions',
  },
];

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}
