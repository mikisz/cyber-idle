export interface Upgrade {
  id: string;
  name: string;
  costCredits: number;
  effects: { atk?: number; hpMax?: number; hackingSpeed?: number };
  description?: string;
  iconText?: string;
}

export const upgrades: Upgrade[] = [
  {
    id: 'neuro_patch_1',
    name: 'Neuro Patch I',
    costCredits: 120,
    effects: { hackingSpeed: 1.05 },
    description: 'Boosts neural signal processing by 5%.',
    iconText: '🧠',
  },
  {
    id: 'muscle_fiber_1',
    name: 'Muscle Fiber Mesh',
    costCredits: 100,
    effects: { atk: 1 },
    description: 'Synthetic fibers enhance strength.',
    iconText: '💪',
  },
  {
    id: 'dermal_plating_1',
    name: 'Dermal Plating I',
    costCredits: 80,
    effects: { hpMax: 10 },
    description: 'Reinforced skin grafts improve survivability.',
    iconText: '🛡',
  },
];

export function getUpgrade(id: string): Upgrade | undefined {
  return upgrades.find((u) => u.id === id);
}
