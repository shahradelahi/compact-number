import { CompactNumberError } from './errors';
import { store } from './store';
import type { FormatRules, Locale } from './typings';

/**
 * Parses a compacted number string back into a number.
 * @param value The compacted string to parse.
 * @param locale The locale to use for parsing symbols. Defaults to 'en'.
 * @returns The uncompacted number.
 * @throws {CompactNumberError} If the input is not a non-empty string, has an invalid number format, or contains an unknown symbol.
 */
export function uncompactNumber(value: string, locale = 'en'): number {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CompactNumberError('Input must be a non-empty string.');
  }

  const symbolMap = getSymbolMap(locale);

  const numberPartMatch = value.match(/[+-]?([0-9]*[.])?[0-9]+/);
  if (!numberPartMatch) {
    throw new CompactNumberError('Invalid number format.');
  }
  const numberPart = parseFloat(numberPartMatch[0]);

  const symbolPart = value.replace(numberPartMatch[0], '').trim().toLowerCase();

  if (!symbolPart) {
    return numberPart;
  }

  const divisor = symbolMap.get(symbolPart);
  if (!divisor) {
    throw new CompactNumberError(`Unknown symbol: "${symbolPart}"`);
  }

  return numberPart * divisor;
}

// Cache for locale-specific symbol maps.
const symbolMapsCache = new Map<string, Map<string, number>>();

function createSymbolMap(localeData: Locale): Map<string, number> {
  const symbolMap = new Map<string, number>();

  function addSymbols(rules: FormatRules) {
    for (const [divisor, formatInfo] of rules) {
      const symbol = formatInfo.one[0].replace(/0+/, '').trim();
      const lowerSymbol = symbol.toLowerCase();
      if (symbol && !symbolMap.has(lowerSymbol)) {
        symbolMap.set(lowerSymbol, divisor);
      }

      const pluralSymbol = formatInfo.other[0].replace(/0+/, '').trim();
      const lowerPluralSymbol = pluralSymbol.toLowerCase();
      if (pluralSymbol && !symbolMap.has(lowerPluralSymbol)) {
        symbolMap.set(lowerPluralSymbol, divisor);
      }
    }
  }

  if (localeData.numbers?.decimal) {
    addSymbols(localeData.numbers.decimal.short);
    addSymbols(localeData.numbers.decimal.long);
  }

  return symbolMap;
}

function getSymbolMap(locale = 'en'): Map<string, number> {
  if (symbolMapsCache.has(locale)) {
    return symbolMapsCache.get(locale)!;
  }

  const localeData = store.get(locale);
  if (!localeData) {
    const enLocaleData = store.get('en');
    if (!enLocaleData) {
      throw new CompactNumberError('Default locale "en" is not registered.');
    }
    const enSymbolMap = createSymbolMap(enLocaleData);
    symbolMapsCache.set('en', enSymbolMap);
    return enSymbolMap;
  }

  const newSymbolMap = createSymbolMap(localeData);
  symbolMapsCache.set(locale, newSymbolMap);
  return newSymbolMap;
}

// Pre-warm the cache with the default 'en' locale.
const enLocaleData = store.get('en');
if (enLocaleData) {
  symbolMapsCache.set('en', createSymbolMap(enLocaleData));
}
