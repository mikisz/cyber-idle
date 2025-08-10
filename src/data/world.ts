export type DistrictStatus = 'locked' | 'available' | 'active';

export interface DistrictAction {
  id: string;
  name: string;
  kind: 'combat' | 'hacking' | 'scavenge';
  minLevel: number;
  baseDurationMs: number;
  rewards: {
    xpSkill: 'combat' | 'hacking' | 'exploration';
    xp: number;
    credits?: { min: number; max: number };
    data?: { min: number; max: number };
  };
  loot?: { itemId: string; chance: number }[];
  iconText?: string;
}

export interface District {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  enemies?: string[];
  lootPreview?: string[];
  actions: DistrictAction[];
}

export const districts: District[] = [
  {
    id: 'neon_market',
    name: 'Neon Market',
    description: 'Bustling bazaar of lights and shady deals.',
    unlockLevel: 1,
    actions: [
      {
        id: 'market_scavenge',
        name: 'Market Scavenge',
        kind: 'scavenge',
        minLevel: 1,
        baseDurationMs: 5000,
        rewards: {
          xpSkill: 'exploration',
          xp: 5,
          credits: { min: 1, max: 5 },
        },
        iconText: '🛒',
      },
      {
        id: 'public_terminals',
        name: 'Public Terminals',
        kind: 'hacking',
        minLevel: 1,
        baseDurationMs: 6000,
        rewards: {
          xpSkill: 'hacking',
          xp: 6,
          data: { min: 1, max: 3 },
        },
        iconText: '💻',
      },
    ],
  },
  {
    id: 'back_alley',
    name: 'Back Alley',
    description: 'Where gangs lurk in the shadows.',
    unlockLevel: 5,
    enemies: ['street_thug'],
    actions: [
      {
        id: 'street_patrol',
        name: 'Street Patrol',
        kind: 'combat',
        minLevel: 1,
        baseDurationMs: 7000,
        rewards: {
          xpSkill: 'combat',
          xp: 10,
          credits: { min: 5, max: 15 },
        },
        iconText: '👊',
      },
    ],
  },
  {
    id: 'skyline_plaza',
    name: 'Skyline Plaza',
    description: 'High-rise hub with lucrative opportunities.',
    unlockLevel: 12,
    enemies: ['street_thug', 'cyber_rat'],
    actions: [
      {
        id: 'plaza_scavenge',
        name: 'Plaza Scavenge',
        kind: 'scavenge',
        minLevel: 1,
        baseDurationMs: 7000,
        rewards: {
          xpSkill: 'exploration',
          xp: 15,
          credits: { min: 10, max: 25 },
        },
        iconText: '🗑️',
      },
      {
        id: 'corporate_network',
        name: 'Corporate Network',
        kind: 'hacking',
        minLevel: 1,
        baseDurationMs: 8000,
        rewards: {
          xpSkill: 'hacking',
          xp: 20,
          data: { min: 5, max: 15 },
        },
        iconText: '🛰️',
      },
      {
        id: 'security_showdown',
        name: 'Security Showdown',
        kind: 'combat',
        minLevel: 1,
        baseDurationMs: 9000,
        rewards: {
          xpSkill: 'combat',
          xp: 25,
          credits: { min: 20, max: 40 },
        },
        iconText: '⚔️',
      },
    ],
  },
];
