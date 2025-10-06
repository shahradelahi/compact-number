import { describe, expect, test } from 'vitest';

import { parseNumberString, round, roundDecimal, toFixed } from './utils';

describe('roundDecimal', () => {
  test('should round down correctly', () => {
    expect(roundDecimal(1.234, 2)).toBe(1.23);
  });

  test('should round up correctly', () => {
    expect(roundDecimal(1.236, 2)).toBe(1.24);
  });

  test('should handle rounding .5 up', () => {
    expect(roundDecimal(1.5, 0)).toBe(2);
    expect(roundDecimal(1.25, 1)).toBe(1.3);
  });

  test('should handle negative numbers correctly', () => {
    expect(roundDecimal(-1.234, 2)).toBe(-1.23);
    expect(roundDecimal(-1.236, 2)).toBe(-1.24);
  });

  test('should handle negative .5 cases away from zero', () => {
    expect(roundDecimal(-1.5, 0)).toBe(-2);
    expect(roundDecimal(-1.25, 1)).toBe(-1.3);
  });

  test('should handle high precision without floating point errors', () => {
    expect(roundDecimal(1.005, 2)).toBe(1.01);
    expect(roundDecimal(0.1 + 0.2, 10)).toBe(0.3);
  });

  test('should handle zero', () => {
    expect(roundDecimal(0, 5)).toBe(0);
  });
});

describe('round', () => {
  // Test suite for 'round' mode
  describe('roundingMode: round', () => {
    test('should round down correctly', () => {
      expect(round(1.234, 2, 'round')).toBe(1.23);
    });

    test('should round up correctly', () => {
      expect(round(1.236, 2, 'round')).toBe(1.24);
    });

    test('should handle rounding .5 up', () => {
      expect(round(1.5, 0, 'round')).toBe(2);
      expect(round(1.25, 1, 'round')).toBe(1.3);
    });

    test('should handle negative numbers', () => {
      expect(round(-1.234, 2, 'round')).toBe(-1.23);
      expect(round(-1.236, 2, 'round')).toBe(-1.24);
      expect(round(-1.5, 0, 'round')).toBe(-2); // Intl.NumberFormat rounds away from zero
    });

    test('should handle zero precision', () => {
      expect(round(9.9, 0, 'round')).toBe(10);
    });

    test('should handle zero value', () => {
      expect(round(0, 5, 'round')).toBe(0);
    });
  });

  // Test suite for 'floor' mode
  describe('roundingMode: floor', () => {
    test('should always round down for positive numbers', () => {
      expect(round(1.239, 2, 'floor')).toBe(1.23);
      expect(round(1.99, 0, 'floor')).toBe(1);
    });

    test('should always round down (away from zero) for negative numbers', () => {
      expect(round(-1.231, 2, 'floor')).toBe(-1.24);
      expect(round(-1.01, 0, 'floor')).toBe(-2);
    });

    test('should handle zero correctly', () => {
      expect(round(0, 2, 'floor')).toBe(0);
    });
  });

  // Test suite for 'ceil' mode
  describe('roundingMode: ceil', () => {
    test('should always round up for positive numbers', () => {
      expect(round(1.231, 2, 'ceil')).toBe(1.24);
      expect(round(1.01, 0, 'ceil')).toBe(2);
    });

    test('should always round up (towards zero) for negative numbers', () => {
      expect(round(-1.239, 2, 'ceil')).toBe(-1.23);
      expect(round(-1.99, 0, 'ceil')).toBe(-1);
    });

    test('should handle zero correctly', () => {
      expect(round(0, 2, 'ceil')).toBe(0);
    });
  });

  // Edge cases
  test('should handle high precision without floating point errors', () => {
    expect(round(0.1 + 0.2, 10, 'round')).toBe(0.3);
    expect(round(1.005, 2, 'round')).toBe(1.01);
  });
});

describe('toFixed', () => {
  const testCases = [
    { num: 999.94, digits: 1 },
    { num: 999.95, digits: 1 },
    { num: 123.456, digits: 2 },
    { num: 123.454, digits: 2 },
    { num: 0.1 + 0.2, digits: 1 }, // Floating point
    { num: 1.005, digits: 2 },
    { num: -999.94, digits: 1 },
    { num: -999.95, digits: 1 },
    { num: 123, digits: 0 },
    { num: 123.0, digits: 2 },
  ];

  test('should produce correct results and match built-in toFixed behavior', () => {
    for (const { num, digits } of testCases) {
      const customResult = toFixed(num, digits);
      const builtInResult = parseFloat(num.toFixed(digits));
      expect(customResult).toBeCloseTo(builtInResult);
    }
  });
});

describe('parseNumberString', () => {
  test('should correctly parse integer numbers', () => {
    expect(parseNumberString('123')).toEqual({ integerPart: '123', fractionalPart: '' });
    expect(parseNumberString('-456')).toEqual({ integerPart: '-456', fractionalPart: '' });
    expect(parseNumberString('0')).toEqual({ integerPart: '0', fractionalPart: '' });
  });

  test('should correctly parse decimal numbers', () => {
    expect(parseNumberString('123.456')).toEqual({ integerPart: '123', fractionalPart: '456' });
    expect(parseNumberString('-123.456')).toEqual({ integerPart: '-123', fractionalPart: '456' });
    expect(parseNumberString('0.123')).toEqual({ integerPart: '0', fractionalPart: '123' });
  });

  test('should handle numbers starting with a decimal point', () => {
    expect(parseNumberString('.123')).toEqual({ integerPart: '', fractionalPart: '123' });
  });

  test('should handle empty fractional part', () => {
    expect(parseNumberString('123.')).toEqual({ integerPart: '123', fractionalPart: '' });
  });

  test('should handle empty string', () => {
    expect(parseNumberString('')).toEqual({ integerPart: '', fractionalPart: '' });
  });
});
