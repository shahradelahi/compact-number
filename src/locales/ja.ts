import type { FormatRules, LocaleData } from '@/typings';

const decimalValues: FormatRules = [
  [1000, { one: ['', 0], other: ['0', 1] }],
  [10000, { one: ['', 0], other: ['0万', 1] }],
  [100000, { one: ['', 0], other: ['00万', 2] }],
  [1000000, { one: ['', 0], other: ['000万', 3] }],
  [10000000, { one: ['', 0], other: ['0000万', 4] }],
  [100000000, { one: ['', 0], other: ['0億', 1] }],
  [1000000000, { one: ['', 0], other: ['00億', 2] }],
  [10000000000, { one: ['', 0], other: ['000億', 3] }],
  [100000000000, { one: ['', 0], other: ['0000億', 4] }],
  [1000000000000, { one: ['', 0], other: ['0兆', 1] }],
  [10000000000000, { one: ['', 0], other: ['00兆', 2] }],
  [100000000000000, { one: ['', 0], other: ['000兆', 3] }],
  [1000000000000000, { one: ['', 0], other: ['0000兆', 4] }],
];

export const ja: LocaleData = {
  ja: {
    locale: 'ja',
    numbers: {
      decimal: {
        short: decimalValues,
        long: decimalValues,
      },
    },
  },
};
