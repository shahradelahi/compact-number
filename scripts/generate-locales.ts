import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

import { parseCLDR } from '@/cldr-utils';

// Path to the CLDR data package
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLDR_NUMBERS_FULL_PATH = path.dirname(
  fileURLToPath(import.meta.resolve('cldr-numbers-full/package.json'))
);

const LOCALES_TO_GENERATE = [
  'de', // German
  'es', // Spanish
  'fr', // French
  'hi', // Hindi
  'ja', // Japanese
  'zh', // Chinese
];

const prettierConfig = await prettier.resolveConfig('@shahrad/prettier-config');

async function writeTypescriptFile(filePath: string, content: string) {
  const formattedContent = await prettier.format(content, {
    ...prettierConfig,
    parser: 'typescript',
  });

  await fs.writeFile(filePath, formattedContent);
}

async function generateLocales() {
  console.log('Starting locale generation...');

  const localesDir = path.resolve(__dirname, '../src/locales');
  await fs.mkdir(localesDir, { recursive: true });

  for (const locale of LOCALES_TO_GENERATE) {
    const filePath = path.join(CLDR_NUMBERS_FULL_PATH, `main/${locale}/numbers.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const cldrData = JSON.parse(fileContent);

    const transformedData = parseCLDR(cldrData);
    const localeObject = transformedData[locale];

    const outputFilePath = path.join(localesDir, `${locale}.ts`);
    let fileContentString;

    if (
      localeObject &&
      JSON.stringify(localeObject.numbers.decimal.short) ===
        JSON.stringify(localeObject.numbers.decimal.long)
    ) {
      const decimalValues = JSON.stringify(localeObject.numbers.decimal.short);
      fileContentString = `import type { FormatRules, LocaleData } from '@/typings';

const decimalValues: FormatRules = ${decimalValues};

export const ${locale}: LocaleData = {
  '${locale}': {
    locale: '${locale}',
    numbers: {
      decimal: {
        short: decimalValues,
        long: decimalValues,
      },
    },
  },
};
`;
    } else {
      fileContentString = `import type { LocaleData } from '@/typings';

export const ${locale}: LocaleData = ${JSON.stringify(transformedData)};
`;
    }

    await writeTypescriptFile(outputFilePath, fileContentString);

    console.log(`Generated and formatted locale file: ${outputFilePath}`);
  }

  await updateLocalesIndex(localesDir);
  console.log('Locale generation complete.');
}

async function updateLocalesIndex(localesDir: string) {
  const files = await fs.readdir(localesDir);
  const indexFilePath = path.join(localesDir, 'index.ts');

  // Filter out index.ts and non-ts files
  const localeFiles = files
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts' && file !== 'en.ts')
    .map((file) => file.replace('.ts', ''));

  const exports = localeFiles.map((locale) => `export * from './${locale}';`).join('\n');
  const indexContent = `export * from './en';
${exports}
`;

  await writeTypescriptFile(indexFilePath, indexContent);
  console.log('Updated and formatted locales/index.ts');
}

generateLocales().catch((error) => {
  console.error('Error generating locales:', error);
  process.exit(1);
});
