import { describe, expect, test } from 'vitest';

import * as Exports from './index';

describe('index exports', () => {
  test('should export compactNumber, uncompactNumber, and store', () => {
    expect(Exports.compactNumber).toBeDefined();
    expect(Exports.uncompactNumber).toBeDefined();
    expect(Exports.store).toBeDefined();
  });

  test('should export locales', () => {
    expect(Exports.en).toBeDefined();
    expect(Exports.de).toBeDefined();
    expect(Exports.es).toBeDefined();
  });
});
