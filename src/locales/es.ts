import type { LocaleData } from '@/typings';

export const es: LocaleData = {
  es: {
    locale: 'es',
    numbers: {
      decimal: {
        short: [
          [1000, { one: ['0 mil', 1], other: ['0 mil', 1] }],
          [10000, { one: ['00 mil', 2], other: ['00 mil', 2] }],
          [100000, { one: ['000 mil', 3], other: ['000 mil', 3] }],
          [1000000, { one: ['0 M', 1], other: ['0 M', 1] }],
          [10000000, { one: ['00 M', 2], other: ['00 M', 2] }],
          [100000000, { one: ['000 M', 3], other: ['000 M', 3] }],
          [1000000000, { one: ['0000 M', 4], other: ['0000 M', 4] }],
          [10000000000, { one: ['00 mil M', 2], other: ['00 mil M', 2] }],
          [100000000000, { one: ['000 mil M', 3], other: ['000 mil M', 3] }],
          [1000000000000, { one: ['0 B', 1], other: ['0 B', 1] }],
          [10000000000000, { one: ['00 B', 2], other: ['00 B', 2] }],
          [100000000000000, { one: ['000 B', 3], other: ['000 B', 3] }],
        ],
        long: [
          [1000, { one: ['0 mil', 1], other: ['0 mil', 1] }],
          [10000, { one: ['00 mil', 2], other: ['00 mil', 2] }],
          [100000, { one: ['000 mil', 3], other: ['000 mil', 3] }],
          [1000000, { one: ['0 millón', 1], other: ['0 millones', 1] }],
          [10000000, { one: ['00 millones', 2], other: ['00 millones', 2] }],
          [100000000, { one: ['000 millones', 3], other: ['000 millones', 3] }],
          [1000000000, { one: ['0 mil millones', 1], other: ['0 mil millones', 1] }],
          [10000000000, { one: ['00 mil millones', 2], other: ['00 mil millones', 2] }],
          [100000000000, { one: ['000 mil millones', 3], other: ['000 mil millones', 3] }],
          [1000000000000, { one: ['0 billón', 1], other: ['0 billones', 1] }],
          [10000000000000, { one: ['00 billones', 2], other: ['00 billones', 2] }],
          [100000000000000, { one: ['000 billones', 3], other: ['000 billones', 3] }],
        ],
      },
    },
  },
};
