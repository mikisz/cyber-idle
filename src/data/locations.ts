export interface LocationLoot {
  itemId: string;
  chance: number;
}

export interface Location {
  id: string;
  name: string;
  enemies: string[]; // enemy IDs
  loot?: LocationLoot[];
  description?: string;
}

export const locations: Location[] = [
  {
    id: 'dark_alley',
    name: 'Dark Alley',
    enemies: ['street_thug'],
    loot: [{ itemId: 'medkit_small', chance: 0.01 }],
    description: 'A shadowy alley where muggers lurk.',
  },
  {
    id: 'abandoned_warehouse',
    name: 'Abandoned Warehouse',
    enemies: ['street_thug', 'cyber_rat'],
    loot: [{ itemId: 'knife_rusty', chance: 0.05 }],
    description: 'Dusty building with hidden corners.',
  },
];

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}
