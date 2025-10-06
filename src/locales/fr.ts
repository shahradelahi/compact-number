import type { LocaleData } from '@/typings';

export const fr: LocaleData = {
  fr: {
    locale: 'fr',
    numbers: {
      decimal: {
        short: [
          [1000, { one: ['0 k', 1], other: ['0 k', 1] }],
          [10000, { one: ['00 k', 2], other: ['00 k', 2] }],
          [100000, { one: ['000 k', 3], other: ['000 k', 3] }],
          [1000000, { one: ['0 M', 1], other: ['0 M', 1] }],
          [10000000, { one: ['00 M', 2], other: ['00 M', 2] }],
          [100000000, { one: ['000 M', 3], other: ['000 M', 3] }],
          [1000000000, { one: ['0 Md', 1], other: ['0 Md', 1] }],
          [10000000000, { one: ['00 Md', 2], other: ['00 Md', 2] }],
          [100000000000, { one: ['000 Md', 3], other: ['000 Md', 3] }],
          [1000000000000, { one: ['0 Bn', 1], other: ['0 Bn', 1] }],
          [10000000000000, { one: ['00 Bn', 2], other: ['00 Bn', 2] }],
          [100000000000000, { one: ['000 Bn', 3], other: ['000 Bn', 3] }],
        ],
        long: [
          [1000, { one: ['0 millier', 1], other: ['0 mille', 1] }],
          [10000, { one: ['00 mille', 2], other: ['00 mille', 2] }],
          [100000, { one: ['000 mille', 3], other: ['000 mille', 3] }],
          [1000000, { one: ['0 million', 1], other: ['0 millions', 1] }],
          [10000000, { one: ['00 million', 2], other: ['00 millions', 2] }],
          [100000000, { one: ['000 million', 3], other: ['000 millions', 3] }],
          [1000000000, { one: ['0 milliard', 1], other: ['0 milliards', 1] }],
          [10000000000, { one: ['00 milliard', 2], other: ['00 milliards', 2] }],
          [100000000000, { one: ['000 milliard', 3], other: ['000 milliards', 3] }],
          [1000000000000, { one: ['0 billion', 1], other: ['0 billions', 1] }],
          [10000000000000, { one: ['00 billion', 2], other: ['00 billions', 2] }],
          [100000000000000, { one: ['000 billion', 3], other: ['000 billions', 3] }],
        ],
      },
    },
  },
};
