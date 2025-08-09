export interface Location {
  id: string;
  name: string;
  enemies: string[]; // enemy IDs
  description?: string;
}

export const locations: Location[] = [
  {
    id: 'slums',
    name: 'Slums',
    enemies: ['street_thug'],
    description: 'A rundown part of the city where anything can happen.',
  },
  {
    id: 'corporate_district',
    name: 'Corporate District',
    enemies: ['street_thug', 'cyber_rat'],
    description: 'Guarded streets of the wealthy elite.',
  },
];

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}
