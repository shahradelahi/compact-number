import type { LocaleData } from '@/typings';

export const de: LocaleData = {
  de: {
    locale: 'de',
    numbers: {
      decimal: {
        short: [
          [1000, { one: ['0 Tsd.', 1], other: ['0 Tsd.', 1] }],
          [10000, { one: ['00 Tsd.', 2], other: ['00 Tsd.', 2] }],
          [100000, { one: ['000 Tsd.', 3], other: ['000 Tsd.', 3] }],
          [1000000, { one: ["0 Mio'.'", 1], other: ["0 Mio'.'", 1] }],
          [10000000, { one: ["00 Mio'.'", 2], other: ["00 Mio'.'", 2] }],
          [100000000, { one: ["000 Mio'.'", 3], other: ["000 Mio'.'", 3] }],
          [1000000000, { one: ["0 Mrd'.'", 1], other: ["0 Mrd'.'", 1] }],
          [10000000000, { one: ["00 Mrd'.'", 2], other: ["00 Mrd'.'", 2] }],
          [100000000000, { one: ["000 Mrd'.'", 3], other: ["000 Mrd'.'", 3] }],
          [1000000000000, { one: ["0 Bio'.'", 1], other: ["0 Bio'.'", 1] }],
          [10000000000000, { one: ["00 Bio'.'", 2], other: ["00 Bio'.'", 2] }],
          [100000000000000, { one: ["000 Bio'.'", 3], other: ["000 Bio'.'", 3] }],
        ],
        long: [
          [1000, { one: ['0 Tausend', 1], other: ['0 Tausend', 1] }],
          [10000, { one: ['00 Tausend', 2], other: ['00 Tausend', 2] }],
          [100000, { one: ['000 Tausend', 3], other: ['000 Tausend', 3] }],
          [1000000, { one: ['0 Million', 1], other: ['0 Millionen', 1] }],
          [10000000, { one: ['00 Millionen', 2], other: ['00 Millionen', 2] }],
          [100000000, { one: ['000 Millionen', 3], other: ['000 Millionen', 3] }],
          [1000000000, { one: ['0 Milliarde', 1], other: ['0 Milliarden', 1] }],
          [10000000000, { one: ['00 Milliarden', 2], other: ['00 Milliarden', 2] }],
          [100000000000, { one: ['000 Milliarden', 3], other: ['000 Milliarden', 3] }],
          [1000000000000, { one: ['0 Billion', 1], other: ['0 Billionen', 1] }],
          [10000000000000, { one: ['00 Billionen', 2], other: ['00 Billionen', 2] }],
          [100000000000000, { one: ['000 Billionen', 3], other: ['000 Billionen', 3] }],
        ],
      },
    },
  },
};
