import { describe, expect, it } from 'vitest';
import { paginate } from './paginate';

const items = Array.from({ length: 25 }, (_, index) => index + 1);

describe('paginate', () => {
  it('returns the first page', () => {
    const result = paginate(items, 1, 10);
    expect(result.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result).toMatchObject({ page: 1, pageCount: 3, total: 25, from: 1, to: 10 });
  });

  it('returns a partly full last page', () => {
    const result = paginate(items, 3, 10);
    expect(result.items).toEqual([21, 22, 23, 24, 25]);
    expect(result).toMatchObject({ page: 3, from: 21, to: 25 });
  });

  it('has no extra empty page when the count divides evenly', () => {
    expect(
      paginate(
        Array.from({ length: 20 }, (_, i) => i),
        1,
        10,
      ).pageCount,
    ).toBe(2);
  });

  it('clamps a page that is too high or too low', () => {
    expect(paginate(items, 99, 10).page).toBe(3);
    expect(paginate(items, 0, 10).page).toBe(1);
    expect(paginate(items, -5, 10).page).toBe(1);
  });

  it('handles an empty list', () => {
    const result = paginate([], 1, 10);
    expect(result).toMatchObject({ items: [], page: 1, pageCount: 1, total: 0, from: 0, to: 0 });
  });

  it('handles a page size bigger than the list', () => {
    const result = paginate(items, 1, 100);
    expect(result.items).toHaveLength(25);
    expect(result.pageCount).toBe(1);
  });

  it('does not change the original list', () => {
    const copy = [...items];
    paginate(items, 2, 10);
    expect(items).toEqual(copy);
  });
});
