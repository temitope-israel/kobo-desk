import type { Currency } from '../types/payment';

const MINOR_UNITS_PER_MAJOR_UNIT = 100;

/** 19.99 (naira) => 1999 (kobo) */
export function toMinor(major: number): number {
  return Math.round(major * MINOR_UNITS_PER_MAJOR_UNIT);
}

/** 1999 (kobo) => 19.99 (naira) */
export function toMajor(minor: number): number {
  return minor / MINOR_UNITS_PER_MAJOR_UNIT;
}

/** 1999, 'NGN' => 'N19.99' */
export function formatMoney(minor: number, currency: Currency, locale = 'en-NG'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(toMajor(minor));
}
