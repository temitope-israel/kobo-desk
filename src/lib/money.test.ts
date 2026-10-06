import { describe, expect, it } from 'vitest';
import { formatMoney, toMajor, toMinor } from './money';

describe('toMinor', () => {
  it('converts naira to kobo', () => {
    expect(toMinor(12.5)).toBe(1250);
  });

  it('avoids floating-point errors', () => {
    expect(19.99 * 100).not.toBe(1999); // plain multiplication is wrong
    expect(toMinor(19.99)).toBe(1999); // our helper is right
    expect(toMinor(0.1 + 0.2)).toBe(30);
  });

  it('rounds to the nearest minor unit', () => {
    expect(toMinor(1234.5678)).toBe(123457);
  });

  it('handles zero', () => {
    expect(toMinor(0)).toBe(0);
  });
});

describe('toMajor', () => {
  it('converts kobo to naira', () => {
    expect(toMajor(1250)).toBe(12.5);
  });

  it('handles zero', () => {
    expect(toMajor(0)).toBe(0);
  });
});

describe('formatMoney', () => {
  it('formats naira with the naira symbol', () => {
    const text = formatMoney(123456, 'NGN');
    expect(text).toContain('₦');
    expect(text).toContain('1,234.56');
  });

  it('always shows two decimal places', () => {
    expect(formatMoney(150000, 'USD')).toContain('1,500.00');
  });

  it('shows thousands separators for large amounts', () => {
    expect(formatMoney(123456789, 'GHS')).toContain('1,234,567.89');
  });

  it('formats zero', () => {
    expect(formatMoney(0, 'KES')).toContain('0.00');
  });
});
