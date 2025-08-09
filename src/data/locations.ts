export interface Location {
  id: string;
  name: string;
  description: string;
  enemies: string[]; // enemy ids
  loot: string[]; // item ids
  encounterRates: { enemy: number; loot: number };
}

export const locations: Location[] = [
  {
    id: 'neon_street',
    name: 'Neon Street',
    description: 'The city\'s bustling thoroughfare.',
    enemies: ['street_thug', 'data_leech'],
    loot: ['medkit', 'small_credchip'],
    encounterRates: { enemy: 0.99, loot: 0.01 },
  },
  {
    id: 'abandoned_factory',
    name: 'Abandoned Factory',
    description: 'Derelict industrial complex crawling with dangers.',
    enemies: ['cyber_bruiser', 'rogue_drone'],
    loot: ['medkit', 'energy_cell'],
    encounterRates: { enemy: 0.9, loot: 0.1 },
  },
  {
    id: 'darkgrid_network',
    name: 'Darkgrid Network',
    description: 'Hidden nodes of the underground net.',
    enemies: ['netrunner', 'ice_program'],
    loot: ['large_credchip', 'data_fragment'],
    encounterRates: { enemy: 0.8, loot: 0.2 },
  },
];

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}
