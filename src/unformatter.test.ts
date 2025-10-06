import { beforeEach, describe, expect, test } from 'vitest';

import { de, es, store } from './index';
import { uncompactNumber } from './unformatter';

describe('uncompactNumber', () => {
  beforeEach(() => {
    store.reset();
    store.register([es, de]);
  });

  test('should uncompact basic numbers', () => {
    expect(uncompactNumber('1.2K')).toBe(1200);
    expect(uncompactNumber('1.5M')).toBe(1500000);
    expect(uncompactNumber('1B')).toBe(1000000000);
    expect(uncompactNumber('1T')).toBe(1000000000000);
  });

  test('should handle negative numbers', () => {
    expect(uncompactNumber('-1.2K')).toBe(-1200);
    expect(uncompactNumber('-1.5M')).toBe(-1500000);
  });

  test('should handle numbers without symbols', () => {
    expect(uncompactNumber('123')).toBe(123);
    expect(uncompactNumber('-456')).toBe(-456);
  });

  test('should handle long styles', () => {
    expect(uncompactNumber('1.2 thousand')).toBe(1200);
    expect(uncompactNumber('2 million')).toBe(2000000);
  });

  test('should handle different locales', () => {
    expect(uncompactNumber('1.2 mil', 'es')).toBe(1200);
    expect(uncompactNumber('1.2 Tsd.', 'de')).toBe(1200);
  });

  test('should throw an error for invalid input', () => {
    expect(() => uncompactNumber('')).toThrow('Input must be a non-empty string.');
    expect(() => uncompactNumber('invalid')).toThrow('Invalid number format.');
    expect(() => uncompactNumber('1.2X')).toThrow('Unknown symbol: "x"');
  });
});
