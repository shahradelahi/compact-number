import { RoundingMode } from './typings';

/**
 * Rounds a decimal number to a specified precision, handling floating-point inaccuracies.
 * @param value The number to round.
 * @param precision The number of decimal places.
 * @returns The rounded number.
 */
export function roundDecimal(value: number, precision: number): number {
  if (!Number.isFinite(value) || !Number.isInteger(precision) || precision < 0) {
    return value; // Or throw an error, depending on desired behavior for invalid input
  }

  const sign = Math.sign(value);
  const absValue = Math.abs(value);

  // Using string manipulation to avoid floating-point issues with multiplication
  const scaledValue = Number(`${absValue}e${precision}`);
  const roundedValue = Math.round(scaledValue);
  const unscaledValue = Number(`${roundedValue}e-${precision}`);

  return unscaledValue * sign;
}

/**
 * Rounds a number to a specified precision using a given rounding mode.
 * @param value The number to round.
 * @param precision The number of decimal places.
 * @param mode The rounding mode.
 * @returns The rounded number.
 */
export function round(value: number, precision: number, mode: RoundingMode): number {
  if (!Number.isFinite(value) || !Number.isInteger(precision) || precision < 0) {
    return value; // Or throw an error
  }

  const multiplier = 10 ** precision;

  switch (mode) {
    case 'floor':
      return Math.floor(value * multiplier) / multiplier;
    case 'ceil':
      return Math.ceil(value * multiplier) / multiplier;
    case 'round':
      return roundDecimal(value, precision);
    default:
      // This should not be reached if RoundingMode is correctly typed,
      // but it's good practice to handle unexpected values.
      throw new Error(`Invalid rounding mode: ${mode}`);
  }
}

/**
 * Pre-scales a number based on the CLDR rule's digit count.
 * This is a crucial step for correct rounding and formatting.
 * e.g., (11234, 1000, 1) -> 1.1234
 * e.g., (11234, 10000, 2) -> 1.1234
 *
 * @param num The number to scale.
 * @param divisor The divisor from the locale rule.
 * @param numberOfDigits The number of digits from the locale rule.
 * @returns The pre-scaled number.
 */
export function preScaleNumber(num: number, divisor: number, numberOfDigits: number): number {
  return (num / divisor) * 10 ** (numberOfDigits - 1);
}

/**
 * Normalizes a locale string to a consistent format (e.g., 'en-US').
 * @param locale The locale string or array of strings to normalize.
 * @returns The normalized locale string.
 */
export function normalizeLocale(locale: string | string[]): string {
  const localeString = Array.isArray(locale) ? locale[0] : locale;
  if (!localeString) {
    return '';
  }
  return localeString.replace(/_/, '-').toLowerCase();
}

/**
 * Cleans up a format string by removing special characters, like quotes.
 * e.g., "'t.'" -> "t."
 * @param str The string to polish.
 * @returns The polished string.
 */
export function polishString(str: string): string {
  return str.replace(/'/g, '');
}

/**
 * Custom toFixed function that rounds to the nearest number,
 * and if the number is halfway, it rounds away from zero (like Number.prototype.toFixed).
 * @param decimal The number to format.
 * @param significantDigits The number of digits to appear after the decimal point.
 * @returns The number rounded to the specified significant digits.
 */
export function toFixed(decimal: number, significantDigits: number): number {
  const powOf10 = Math.pow(10, significantDigits);
  const scaled = decimal * powOf10;
  // Custom rounding to handle .5 away from zero for both positive and negative numbers
  const rounded = Math.round(Math.abs(scaled) + Number.EPSILON) * Math.sign(scaled);
  return rounded / powOf10;
}

/**
 * Efficiently parses a number string to extract its integer and fractional parts.
 * Avoids the overhead of String.prototype.split() by using indexOf() and substring().
 * @param formattedNumberString The number string to parse (e.g., "123.45", "123").
 * @returns An object containing the integerPart and fractionalPart.
 */
export function parseNumberString(formattedNumberString: string): {
  integerPart: string;
  fractionalPart: string;
} {
  const dotIndex = formattedNumberString.indexOf('.');
  if (dotIndex !== -1) {
    return {
      integerPart: formattedNumberString.substring(0, dotIndex),
      fractionalPart: formattedNumberString.substring(dotIndex + 1),
    };
  } else {
    return {
      integerPart: formattedNumberString,
      fractionalPart: '',
    };
  }
}
