import type { FormatRule, FormatRules, LocaleData } from '@/typings';

/**
 * Transforms raw CLDR number formatting data into the internal structure.
 * @param cldrFormat The raw CLDR decimal format object.
 * @returns The transformed format rules.
 */
function transformCLDRData(cldrFormat: Record<string, string>): FormatRules {
  const rules: FormatRules = [];
  for (const key in cldrFormat) {
    const parts = key.split('-');
    if (parts.length < 2) continue;

    const power = parts[0];
    const plural = parts[parts.length - 1];

    if (plural !== 'one' && plural !== 'other') continue;

    const numPower = Number(power);
    if (numPower > Number.MAX_SAFE_INTEGER) {
      continue;
    }

    const formatString = cldrFormat[key]!;
    const numZeros = (formatString.match(/0/g) || []).length;

    let rule = rules.find((r) => r[0] === numPower);
    if (!rule) {
      rule = [
        numPower,
        {
          one: ['', 0],
          other: ['', 0],
        },
      ] as FormatRule;
      rules.push(rule);
    }

    rule[1][plural] = [formatString, numZeros];
  }
  return rules.sort((a, b) => a[0] - b[0]);
}

/**
 * Parses raw CLDR data and transforms it into the application's internal format.
 * @param cldrData The raw CLDR data object.
 * @returns The transformed locale data.
 */
export function parseCLDR(cldrData: any): LocaleData {
  const localeKey = Object.keys(cldrData.main)[0]!;
  const cldrNumbers = cldrData.main[localeKey].numbers;
  const latnFormats = cldrNumbers['decimalFormats-numberSystem-latn'];

  const transformedData: LocaleData = {
    [localeKey]: {
      locale: localeKey,
      numbers: {
        decimal: {
          short: transformCLDRData(latnFormats.short.decimalFormat),
          long: transformCLDRData(latnFormats.long.decimalFormat),
        },
      },
    },
  };

  // Special case for German 'Tsd.' abbreviation
  if (localeKey === 'de') {
    const shortRules = transformedData['de']!.numbers.decimal.short;
    const thousandRule = shortRules.find((r) => r[0] === 1000);
    if (thousandRule) {
      thousandRule[1].one = ['0 Tsd.', 1];
      thousandRule[1].other = ['0 Tsd.', 1];
    }
    const tenThousandRule = shortRules.find((r) => r[0] === 10000);
    if (tenThousandRule) {
      tenThousandRule[1].one = ['00 Tsd.', 2];
      tenThousandRule[1].other = ['00 Tsd.', 2];
    }
    const hundredThousandRule = shortRules.find((r) => r[0] === 100000);
    if (hundredThousandRule) {
      hundredThousandRule[1].one = ['000 Tsd.', 3];
      hundredThousandRule[1].other = ['000 Tsd.', 3];
    }
  }

  return transformedData;
}
