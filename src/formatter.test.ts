import { beforeEach, describe, expect, test } from 'vitest';

import { compactNumber } from './formatter';
import { de, es } from './locales';
import { store } from './store';
import type { LocaleData } from './typings';

describe('compactNumber', () => {
  beforeEach(() => {
    store.reset();
    // Register locales needed for tests
    store.register([es, de]);
  });

  describe('Basic Formatting', () => {
    test('should format numbers correctly for "en" locale', () => {
      expect(compactNumber(1234)).toBe('1.2K');
      expect(compactNumber(1500000)).toBe('1.5M');
      expect(compactNumber(1000)).toBe('1K');
      expect(compactNumber(1000000)).toBe('1M');
      expect(compactNumber(1000000000)).toBe('1B');
      expect(compactNumber(1000000000000)).toBe('1T');
    });

    test('should handle negative numbers', () => {
      expect(compactNumber(-1234)).toBe('-1.2K');
      expect(compactNumber(-1500000)).toBe('-1.5M');
    });

    test('should handle zero and numbers less than 1000', () => {
      expect(compactNumber(0)).toBe('0');
      expect(compactNumber(-0)).toBe('0');
      expect(compactNumber(123)).toBe('123');
      expect(compactNumber(-456)).toBe('-456');
      expect(compactNumber(999)).toBe('999');
    });
  });

  describe('Options', () => {
    test('should handle different maximumFractionDigits', () => {
      expect(compactNumber(1234, { maximumFractionDigits: 2 })).toBe('1.23K');
      expect(compactNumber(1234, { maximumFractionDigits: 0 })).toBe('1K');
      expect(compactNumber(1678, { maximumFractionDigits: 0 })).toBe('2K');
      expect(compactNumber(9999, { maximumFractionDigits: 0 })).toBe('10K');
    });

    test('should handle different minimumFractionDigits', () => {
      expect(compactNumber(1200, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe(
        '1.20K'
      );
      expect(compactNumber(1234, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe(
        '1.23K'
      );
      expect(compactNumber(1000, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe(
        '1.00K'
      );
      expect(compactNumber(123, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe(
        '123.00'
      );
    });

    test('should handle different styles', () => {
      expect(compactNumber(1234, { style: 'long' })).toBe('1.2 thousand');
      expect(compactNumber(2000000, { style: 'long' })).toBe('2 million');
      expect(compactNumber(1, { style: 'long' })).toBe('1');
    });

    test('should handle different rounding modes', () => {
      // Round
      expect(compactNumber(1290, { maximumFractionDigits: 0, roundingMode: 'round' })).toBe('1K');
      expect(compactNumber(1550, { maximumFractionDigits: 1, roundingMode: 'round' })).toBe('1.6K');
      expect(compactNumber(1990, { maximumFractionDigits: 0, roundingMode: 'round' })).toBe('2K');

      // Floor
      expect(compactNumber(1290, { maximumFractionDigits: 0, roundingMode: 'floor' })).toBe('1K');
      expect(compactNumber(1550, { maximumFractionDigits: 1, roundingMode: 'floor' })).toBe('1.5K');
      expect(compactNumber(1990, { maximumFractionDigits: 0, roundingMode: 'floor' })).toBe('1K');

      // Ceil
      expect(compactNumber(1290, { maximumFractionDigits: 0, roundingMode: 'ceil' })).toBe('2K');
      expect(compactNumber(1550, { maximumFractionDigits: 1, roundingMode: 'ceil' })).toBe('1.6K');
      expect(compactNumber(1010, { maximumFractionDigits: 0, roundingMode: 'ceil' })).toBe('2K');
    });

    test('should handle minimumFractionDigits for padding', () => {
      expect(compactNumber(1200, { maximumFractionDigits: 2, minimumFractionDigits: 2 })).toBe(
        '1.20K'
      );
      expect(compactNumber(1200, { maximumFractionDigits: 2 })).toBe('1.2K');
      expect(compactNumber(1000, { maximumFractionDigits: 2 })).toBe('1K');
      expect(compactNumber(1234, { maximumFractionDigits: 0 })).toBe('1K');
      expect(compactNumber(1234, { maximumFractionDigits: 1 })).toBe('1.2K');
      expect(compactNumber(1234, { maximumFractionDigits: 2 })).toBe('1.23K');
      expect(compactNumber(1230, { maximumFractionDigits: 2 })).toBe('1.23K');
      expect(compactNumber(1200, { maximumFractionDigits: 0 })).toBe('1K');
      expect(compactNumber(1200, { maximumFractionDigits: 1 })).toBe('1.2K');
      expect(compactNumber(1200, { maximumFractionDigits: 2 })).toBe('1.2K');
    });
  });

  describe('Locales', () => {
    test('should handle different built-in locales', () => {
      expect(compactNumber(1234, { locale: 'es' })).toBe('1.2 mil');
      expect(compactNumber(1234, { locale: 'de' })).toBe('1.2 Tsd.');
    });

    test('should handle pluralization correctly for "es" locale', () => {
      expect(
        compactNumber(1000000, { locale: 'es', style: 'long', maximumFractionDigits: 0 })
      ).toBe('1 millón');
      expect(compactNumber(1500000, { locale: 'es', style: 'long' })).toBe('1.5 millones');
      expect(
        compactNumber(2000000, { locale: 'es', style: 'long', maximumFractionDigits: 0 })
      ).toBe('2 millones');
    });

    test('should handle custom locale data', () => {
      const customLocale: LocaleData = {
        'fr-CA': {
          locale: 'fr-CA',
          numbers: {
            decimal: {
              long: [[1000, { one: ['0 mille', 1], other: ['0 mille', 1] }]],
              short: [[1000, { one: ['0k', 1], other: ['0k', 1] }]],
            },
          },
        },
      };
      expect(compactNumber(1234, { locale: 'fr-CA', localeData: customLocale })).toBe('1.2k');
    });

    test('should override existing locale data', () => {
      const customEn: LocaleData = {
        en: {
          locale: 'en',
          numbers: {
            decimal: {
              long: [[1000, { one: ['0 thousand', 1], other: ['0 thousand', 1] }]],
              short: [[1000, { one: ['0 Grand', 1], other: ['0 Grand', 1] }]],
            },
          },
        },
      };
      expect(compactNumber(1234, { locale: 'en', localeData: customEn })).toBe('1.2 Grand');
    });
  });

  describe('Error Handling', () => {
    test('should throw an error for invalid input', () => {
      expect(() => compactNumber('invalid')).toThrow('Input must be a finite number.');
      // @ts-expect-error Testing invalid input
      expect(() => compactNumber(undefined)).toThrow('Input must be a finite number.');
      expect(() => compactNumber(NaN)).toThrow('Input must be a finite number.');
    });

    test('should handle null input as zero', () => {
      // @ts-expect-error Testing invalid input
      expect(compactNumber(null)).toBe('0');
    });

    test('should throw an error for invalid maximumFractionDigits', () => {
      expect(() => compactNumber(1234, { maximumFractionDigits: -1 })).toThrow(
        'Fraction digits must be non-negative numbers.'
      );
    });

    test('should throw an error for invalid minimumFractionDigits', () => {
      expect(() => compactNumber(1234, { minimumFractionDigits: -1 })).toThrow(
        'Fraction digits must be non-negative numbers.'
      );
    });

    test('should throw an error when minimumFractionDigits > maximumFractionDigits', () => {
      expect(() =>
        compactNumber(1234, { minimumFractionDigits: 2, maximumFractionDigits: 1 })
      ).toThrow('minimumFractionDigits cannot be greater than maximumFractionDigits.');
    });

    test('should throw an error for unknown locale', () => {
      expect(() => compactNumber(1234, { locale: 'unknown' })).toThrow(
        'Locale "unknown" has not been registered. Please register it using "store.register()".'
      );
    });

    test('should throw an error for invalid rounding mode', () => {
      expect(() => compactNumber(1234, { roundingMode: 'invalid' as any })).toThrow(
        'Invalid rounding mode: invalid'
      );
    });
  });

  describe('Boundary Conditions', () => {
    test('should handle numbers at the threshold', () => {
      expect(compactNumber(1000)).toBe('1K');
      expect(compactNumber(1000000)).toBe('1M');
    });

    test('should handle numbers just below the threshold', () => {
      expect(compactNumber(999)).toBe('999');
      expect(compactNumber(999999)).toBe('1M');
    });

    test('should handle rounding that crosses a threshold', () => {
      expect(compactNumber(999.9, { maximumFractionDigits: 0 })).toBe('1K');
      expect(compactNumber(999999, { maximumFractionDigits: 0 })).toBe('1M');
      expect(compactNumber(999500, { maximumFractionDigits: 0 })).toBe('1M');
    });
  });

  describe('Intl.NumberFormat Comparison', () => {
    // Helper to normalize whitespace, especially non-breaking spaces from Intl.NumberFormat
    const normalize = (str: string) => str.replace(/\s/g, ' ');

    test('should match Intl.NumberFormat for Spanish (11234)', () => {
      const number = 11234;
      const locale = 'es';
      const options = { maximumFractionDigits: 0 };
      const intlResult = new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: options.maximumFractionDigits,
      }).format(number);

      expect(normalize(compactNumber(number, { ...options, locale }))).toBe(normalize(intlResult));
    });

    test('should match Intl.NumberFormat for English (999999)', () => {
      const number = 999999;
      const locale = 'en';
      const options = { maximumFractionDigits: 0 };
      const intlResult = new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: options.maximumFractionDigits,
      }).format(number);

      expect(normalize(compactNumber(number, { ...options, locale }))).toBe(normalize(intlResult));
    });

    test('should match Intl.NumberFormat for long style', () => {
      const number = 12345;
      const locale = 'en';
      const options = {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
        style: 'long',
      } as const;
      const intlResult = new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: options.style,
        maximumFractionDigits: options.maximumFractionDigits,
        minimumFractionDigits: options.minimumFractionDigits,
      }).format(number);

      expect(normalize(compactNumber(number, { ...options, locale }))).toBe(normalize(intlResult));
    });

    test('should match Intl.NumberFormat for negative numbers', () => {
      const number = -5678;
      const locale = 'en';
      const options = { maximumFractionDigits: 1 };
      const intlResult = new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: options.maximumFractionDigits,
      }).format(number);

      expect(normalize(compactNumber(number, { ...options, locale }))).toBe(normalize(intlResult));
    });

    test('should match Intl.NumberFormat for higher maximumFractionDigits', () => {
      const number = 123456;
      const locale = 'en';
      const options = { maximumFractionDigits: 2, minimumFractionDigits: 2 };
      const intlResult = new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: options.maximumFractionDigits,
        minimumFractionDigits: options.minimumFractionDigits,
      }).format(number);
      const result = compactNumber(number, { ...options, locale });

      expect(normalize(result)).toBe(normalize(intlResult));
    });
  });
});
