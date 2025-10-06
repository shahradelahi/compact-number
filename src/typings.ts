export type RoundingMode = 'round' | 'floor' | 'ceil';

export interface CompactNumberOptions {
  /**
   * The locale to use for formatting. Defaults to 'en'.
   */
  locale?: string;
  /**
   * Custom locale data to register for the current call. This will override any existing locale data.
   */
  localeData?: LocaleData;
  /**
   * The formatting style to use. 'short' for compact abbreviations (e.g., 1.2K), 'long' for full words (e.g., 1.2 thousand). Defaults to 'short'.
   */
  style?: 'short' | 'long';
  /**
   * The minimum number of fraction digits to use. Defaults to 0.
   */
  minimumFractionDigits?: number;
  /**
   * The maximum number of fraction digits to use. Defaults to 1.
   */
  maximumFractionDigits?: number;
  /**
   * The rounding mode to apply. Defaults to 'round'.
   */
  roundingMode?: RoundingMode;
  /**
   * A threshold value used for tier-jumping logic. Defaults to 0.0005.
   */
  threshold?: number;
}

/**
 * A tuple representing the format string and the number of digits for a number format.
 * @example ['0K', 1]
 */
export type FormatTuple = [string, number];

/**
 * An object containing pluralization rules for a number format.
 */
export interface PluralizedFormat {
  one: FormatTuple;
  other: FormatTuple;
}

/**
 * A rule for formatting a number, consisting of a threshold and the corresponding format.
 * @example [1000, { one: ['0K', 1], other: ['0K', 1] }]
 */
export type FormatRule = [number, PluralizedFormat];

/**
 * An array of formatting rules for a specific style (e.g., 'short' or 'long').
 */
export type FormatRules = Array<FormatRule>;

export interface Locale {
  numbers: {
    decimal: {
      long: FormatRules;
      short: FormatRules;
    };
  };
  locale: string;
  parentLocale?: string;
}

export interface LocaleData {
  [locale: string]: Locale;
}
