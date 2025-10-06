import { CompactNumberError } from './errors';
import { store } from './store';
import type { CompactNumberOptions, FormatRule, Locale, RoundingMode } from './typings';
import { normalizeLocale, polishString, preScaleNumber, round } from './utils';

export function compactNumber(value: number | string, options: CompactNumberOptions = {}): string {
  const {
    locale = 'en',
    localeData: customLocaleData,
    style = 'short',
    minimumFractionDigits = 0,
    maximumFractionDigits = 1,
    roundingMode = 'round',
    threshold = 0.0005,
  } = options;

  if (customLocaleData) {
    store.register(customLocaleData);
  }

  const num = Number(value);
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    if (value === null) return '0';
    throw new CompactNumberError('Input must be a finite number.');
  }

  if (maximumFractionDigits < 0 || minimumFractionDigits < 0) {
    throw new CompactNumberError('Fraction digits must be non-negative numbers.');
  }

  if (minimumFractionDigits > maximumFractionDigits) {
    throw new CompactNumberError(
      'minimumFractionDigits cannot be greater than maximumFractionDigits.'
    );
  }

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const localeInfo = findLocaleData(locale);
  const rules =
    style === 'long' ? localeInfo.numbers.decimal.long : localeInfo.numbers.decimal.short;

  if (absNum < 1000) {
    const rounded = round(num, maximumFractionDigits, roundingMode);
    if (Math.abs(rounded) >= 1000) {
      return formatValue(
        rounded,
        rounded < 0,
        rules[0]!,
        minimumFractionDigits,
        maximumFractionDigits,
        roundingMode
      );
    }
    return formatNumberString(rounded, minimumFractionDigits, maximumFractionDigits);
  }

  let matchingRule: FormatRule | undefined;
  let matchingRuleIndex = -1;
  for (let i = 0; i < rules.length; i++) {
    if (absNum >= rules[i]![0]) {
      matchingRule = rules[i];
      matchingRuleIndex = i;
    } else {
      break;
    }
  }

  if (!matchingRule) {
    const rounded = round(num, maximumFractionDigits, roundingMode);
    return formatNumberString(rounded, minimumFractionDigits, maximumFractionDigits);
  }

  // Threshold-based tier-jumping logic
  const nextRule = rules[matchingRuleIndex + 1];
  if (nextRule) {
    const [nextDivisor] = nextRule;
    if (1 - absNum / nextDivisor <= threshold) {
      matchingRule = nextRule;
    }
  }

  return formatValue(
    num,
    isNegative,
    matchingRule,
    minimumFractionDigits,
    maximumFractionDigits,
    roundingMode
  );
}

function findLocaleData(locale: string): Locale {
  const normalized = normalizeLocale(locale);
  const localeInfo = store.get(normalized);
  if (!localeInfo) {
    throw new CompactNumberError(
      `Locale "${locale}" has not been registered. Please register it using "store.register()".`
    );
  }
  return localeInfo;
}

function formatNumberString(
  value: number,
  minimumFractionDigits: number,
  maximumFractionDigits: number
): string {
  const fixedString = value.toFixed(maximumFractionDigits);
  const dotIndex = fixedString.indexOf('.');

  if (dotIndex === -1) {
    if (minimumFractionDigits > 0) {
      return `${fixedString}.${'0'.repeat(minimumFractionDigits)}`;
    }
    return fixedString;
  }

  const integerPart = fixedString.substring(0, dotIndex);
  let fractionalPart = fixedString.substring(dotIndex + 1);

  while (fractionalPart.length > minimumFractionDigits && fractionalPart.endsWith('0')) {
    fractionalPart = fractionalPart.slice(0, -1);
  }

  if (fractionalPart) {
    return `${integerPart}.${fractionalPart}`;
  } else {
    return integerPart;
  }
}

function formatValue(
  num: number,
  isNegative: boolean,
  rule: FormatRule,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
  roundingMode: RoundingMode
): string {
  const [divisor, formatInfo] = rule;
  const absNum = Math.abs(num);

  // For numbers that round up to the next tier (e.g., 999.9 -> 1K),
  // we need to use the scaled and rounded value, not the original number.
  const valueToFormat = absNum >= divisor ? absNum : num;
  const preScaled = preScaleNumber(Math.abs(valueToFormat), divisor, formatInfo.other[1]);
  const rounded = round(preScaled, maximumFractionDigits, roundingMode);

  const [formatString] = rounded === 1 ? formatInfo.one : formatInfo.other;
  const finalValue = isNegative ? -rounded : rounded;

  const finalValueAsString = formatNumberString(
    finalValue,
    minimumFractionDigits,
    maximumFractionDigits
  );

  return polishString(formatString.replace(/0+/, finalValueAsString));
}
