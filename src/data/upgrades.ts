export interface Upgrade {
  id: string;
  name: string;
  costCredits: number;
  costData?: number;
  effects: { hackingSpeed?: number; atk?: number; hpMax?: number };
  description?: string;
  iconText?: string;
}

export const upgrades: Upgrade[] = [
  {
    id: 'neuro_patch_1',
    name: 'Neuro Patch I',
    costCredits: 120,
    costData: 20,
    effects: { hackingSpeed: 1.05 },
    iconText: '🧠',
  },
  {
    id: 'tendo_servo_1',
    name: 'Tendo-Servo I',
    costCredits: 150,
    effects: { atk: 2 },
    iconText: '⚙️',
  },
  {
    id: 'subdermal_armor_1',
    name: 'Subdermal Armor I',
    costCredits: 130,
    effects: { hpMax: 15 },
    iconText: '🛡️',
  },
];

export function getUpgrade(id: string): Upgrade | undefined {
  return upgrades.find((u) => u.id === id);
}
