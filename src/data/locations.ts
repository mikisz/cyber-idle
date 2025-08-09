export interface Location {
  id: string;
  name: string;
  enemies: string[]; // enemy IDs
  description?: string;
  lootTable?: { itemId: string; chance: number; min?: number; max?: number }[];
  eventChances?: { enemy: number; loot: number };
}

export const locations: Location[] = [
  {
    id: 'slums',
    name: 'Slums',
    enemies: ['street_thug'],
    description: 'A rundown part of the city where anything can happen.',
    lootTable: [{ itemId: 'scrap_metal', chance: 0.5 }],
    eventChances: { enemy: 0.99, loot: 0.01 },
  },
  {
    id: 'corporate_district',
    name: 'Corporate District',
    enemies: ['street_thug', 'cyber_rat'],
    description: 'Guarded streets of the wealthy elite.',
    lootTable: [
      { itemId: 'credits', chance: 0.8, min: 10, max: 50 },
      { itemId: 'rare_blade', chance: 0.02 },
    ],
    eventChances: { enemy: 0.99, loot: 0.01 },
  },
];

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}
