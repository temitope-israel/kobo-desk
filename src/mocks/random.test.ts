import { describe, expect, it } from 'vitest';
import { createRandom } from './random';

describe('createRandom', () => {
  it('gives the same sequence for the same seed', () => {
    const a = createRandom(42);
    const b = createRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('gives different numbers for different seeds', () => {
    expect(createRandom(1)()).not.toBe(createRandom(2)());
  });

  it('stays between 0 (included) and 1 (excluded)', () => {
    const random = createRandom(7);
    for (let i = 0; i < 1000; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
