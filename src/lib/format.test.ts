import { describe, expect, it } from 'vitest';
import { formatCompactNumber, formatDateTime, formatDay, formatPercent } from './format';

describe('formatPercent', () => {
  it('turns a fraction into a percentage with one decimal', () => {
    expect(formatPercent(0.8571)).toContain('85.7');
    expect(formatPercent(0.8571)).toContain('%');
  });

  it('handles 0 and 1', () => {
    expect(formatPercent(0)).toContain('0.0');
    expect(formatPercent(1)).toContain('%');
  });
});

describe('formatCompactNumber', () => {
  it('shortens thousands and millions', () => {
    expect(formatCompactNumber(1500)).toBe('1.5K');
    expect(formatCompactNumber(2_300_000)).toBe('2.3M');
  });

  it('leaves small numbers alone', () => {
    expect(formatCompactNumber(950)).toBe('950');
  });
});

describe('formatDay', () => {
  it('shows the month and day for a day key', () => {
    const text = formatDay('2026-10-06');
    expect(text).toContain('Oct');
    expect(text).toContain('6');
  });
});

describe('formatDateTime', () => {
  it('shows the time in the requested time zone', () => {
    const iso = '2026-10-10T23:30:00.000Z';
    expect(formatDateTime(iso, 'UTC')).toContain('23:30');
    expect(formatDateTime(iso, 'Africa/Lagos')).toContain('00:30'); // One hour ahead, next day
  });
});
