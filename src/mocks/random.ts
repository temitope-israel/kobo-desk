/**
 * A small random number generator. The same seed always gives the same sequence of numbers (this recipe is called "mulberry32").
 *
 */

export function createRandom(seed: number) {
  let state = seed;

  return function random(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
