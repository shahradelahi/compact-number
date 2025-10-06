import type { FormatRules, LocaleData } from '@/typings';

const decimalValues: FormatRules = [
  [1000, { one: ['', 0], other: ['0', 1] }],
  [10000, { one: ['', 0], other: ['0万', 1] }],
  [100000, { one: ['', 0], other: ['00万', 2] }],
  [1000000, { one: ['', 0], other: ['000万', 3] }],
  [10000000, { one: ['', 0], other: ['0000万', 4] }],
  [100000000, { one: ['', 0], other: ['0亿', 1] }],
  [1000000000, { one: ['', 0], other: ['00亿', 2] }],
  [10000000000, { one: ['', 0], other: ['000亿', 3] }],
  [100000000000, { one: ['', 0], other: ['0000亿', 4] }],
  [1000000000000, { one: ['', 0], other: ['0万亿', 1] }],
  [10000000000000, { one: ['', 0], other: ['00万亿', 2] }],
  [100000000000000, { one: ['', 0], other: ['000万亿', 3] }],
];

export const zh: LocaleData = {
  zh: {
    locale: 'zh',
    numbers: {
      decimal: {
        short: decimalValues,
        long: decimalValues,
      },
    },
  },
};
