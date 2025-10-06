import { bench, describe } from 'vitest';

import { compactNumber } from './index';

describe('compactNumber vs. Intl.NumberFormat', () => {
  const numbers = [123, 1234, 12345, 123456, 1234567, 12345678, 123456789, 1234567890];

  bench('@se-oss/compact-number', () => {
    for (const number of numbers) {
      compactNumber(number, {
        style: 'short',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    }
  });

  bench('Intl.NumberFormat', () => {
    const formatter = new Intl.NumberFormat('en', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
    for (const number of numbers) {
      formatter.format(number);
    }
  });
});
