import { describe, expect, it } from 'vitest';
import { getPeriodDays, isDayKey, toDayKey } from './dates';

const NOW = Date.parse('2026-10-10T12:00:00.000Z');

describe('toDayKey', () => {
  it('gives the calendar day in a time zone', () => {
    const moment = '2026-10-10T23:30:00.000Z';
    expect(toDayKey(moment, 'UTC')).toBe('2026-10-10');
    expect(toDayKey(moment, 'Africa/Lagos')).toBe('2026-10-11');
  });
});

describe('getPeriodDays', () => {
  it('lists the last N days, oldest first, ending today', () => {
    expect(getPeriodDays(3, NOW, 'UTC')).toEqual(['2026-10-08', '2026-10-09', '2026-10-10']);
  });
});

describe('isDayKey', () => {
  it('accepts real days, including a leap day', () => {
    expect(isDayKey('2026-10-06')).toBe(true);
    expect(isDayKey('2028-02-29')).toBe(true);
  });

  it('rejects days that do not exist', () => {
    expect(isDayKey('2026-02-31')).toBe(false);
    expect(isDayKey('2026-13-01')).toBe(false);
    expect(isDayKey('2026-00-10')).toBe(false);
  });

  it('rejects text that is not a day', () => {
    expect(isDayKey('abc')).toBe(false);
    expect(isDayKey('2026-1-5')).toBe(false);
    expect(isDayKey('')).toBe(false);
    expect(isDayKey(null)).toBe(false);
  });
});
