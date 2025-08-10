export interface HackingAction {
  id: string;
  name: string;
  minLevel: number;
  baseDurationMs: number;
  rewards: {
    xp: number;
    credits: { min: number; max: number };
    data?: { min: number; max: number };
  };
  loot?: { itemId: string; chance: number }[];
  iconText: string;
}

export const hackingActions: HackingAction[] = [
  {
    id: 'street_terminals',
    name: 'Street Terminals',
    minLevel: 1,
    baseDurationMs: 6000,
    rewards: {
      xp: 5,
      credits: { min: 20, max: 40 },
      data: { min: 1, max: 3 },
    },
    loot: [{ itemId: 'neural_chip', chance: 0.01 }],
    iconText: '🖧',
  },
  {
    id: 'corp_kiosks',
    name: 'Corp Kiosks',
    minLevel: 10,
    baseDurationMs: 9000,
    rewards: {
      xp: 10,
      credits: { min: 40, max: 80 },
      data: { min: 2, max: 5 },
    },
    loot: [{ itemId: 'neural_chip', chance: 0.02 }],
    iconText: '🏢',
  },
  {
    id: 'darkgrid_nodes',
    name: 'Darkgrid Nodes',
    minLevel: 20,
    baseDurationMs: 12000,
    rewards: {
      xp: 15,
      credits: { min: 80, max: 140 },
      data: { min: 4, max: 8 },
    },
    loot: [{ itemId: 'neural_chip', chance: 0.03 }],
    iconText: '🌐',
  },
];

export function getHackingAction(id: string): HackingAction | undefined {
  return hackingActions.find((a) => a.id === id);
}
