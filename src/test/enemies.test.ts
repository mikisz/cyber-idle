import { describe, it, expect } from 'vitest';
import { getEnemyById } from '../data/enemies';

describe('getEnemyById', () => {
  it('returns enemy with matching id', () => {
    const enemy = getEnemyById('street_thug');
    expect(enemy).toBeDefined();
    expect(enemy?.id).toBe('street_thug');
  });
});
