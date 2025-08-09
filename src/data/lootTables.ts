export type LootTable = {
  locationId: string;
  enemies?: string[]; // enemy IDs
  drops: { itemId: string; chance: number; min?: number; max?: number }[];
};

export const lootTables: LootTable[] = [
  {
    locationId: 'slums',
    drops: [
      { itemId: 'scrap_metal', chance: 0.5 },
    ],
  },
  {
    locationId: 'corporate_district',
    drops: [
      { itemId: 'credits', chance: 0.8, min: 10, max: 50 },
      { itemId: 'rare_blade', chance: 0.02 },
    ],
  },
];

export function getLootTable(locationId: string): LootTable | undefined {
  return lootTables.find((l) => l.locationId === locationId);
}

export function rollLoot(locationId: string) {
  const table = getLootTable(locationId);
  const items: { itemId: string; quantity: number }[] = [];
  let credits = 0;
  if (!table) return { items, credits };
  for (const drop of table.drops) {
    if (Math.random() < drop.chance) {
      const qty =
        drop.min !== undefined && drop.max !== undefined
          ? Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min
          : drop.min ?? 1;
      if (drop.itemId === 'credits') {
        credits += qty;
      } else {
        items.push({ itemId: drop.itemId, quantity: qty });
      }
    }
  }
  return { items, credits };
}

