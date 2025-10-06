import { en } from '@/locales';

import { parseCLDR } from './cldr-utils';
import { CompactNumberError } from './errors';
import type { Locale, LocaleData } from './typings';
import { normalizeLocale } from './utils';

const defaultLocales: LocaleData = {
  ...en,
};

/**
 * Manages the registration and retrieval of locale data for compact number formatting.
 * This store ensures that locale definitions are accessible throughout the application
 * and supports tree-shaking by allowing explicit registration of needed locales.
 */
class LocaleStore {
  #locales: LocaleData = { ...defaultLocales };

  /**
   * Registers one or more locale data objects from raw CLDR JSON imports.
   * @param cldrData A single raw CLDR data object or an array of them.
   */
  public registerFromCLDR(cldrData: any | any[]): void {
    const cldrDataArray = Array.isArray(cldrData) ? cldrData : [cldrData];

    for (const data of cldrDataArray) {
      if (!data.main) continue;
      const transformedData = parseCLDR(data);
      this.register(transformedData);
    }
  }

  /**
   * (Node.js only) Registers all available locales from the `cldr-numbers-full` package.
   * This function dynamically reads and processes all locale files from the package.
   * It will throw an error if used in a non-Node.js environment.
   * @throws {CompactNumberError} If not in a Node.js environment or if `cldr-numbers-full` is not found.
   */
  public async registerFullCLDR(): Promise<void> {
    try {
      const { createRequire } = await import('node:module');
      const fs = await import('node:fs/promises');
      const path = await import('node:path');

      const require = createRequire(import.meta.url);
      const cldrNumbersFullPath = path.dirname(require.resolve('cldr-numbers-full/package.json'));
      const cldrMainPath = path.join(cldrNumbersFullPath, 'main');

      const localeDirs = await fs.readdir(cldrMainPath, { withFileTypes: true });

      const localesToRegister = [];
      for (const dirent of localeDirs) {
        if (dirent.isDirectory()) {
          const localeId = dirent.name;
          const numbersJsonPath = path.join(cldrMainPath, localeId, 'numbers.json');
          try {
            await fs.access(numbersJsonPath);
            const cldrData = require(numbersJsonPath);
            localesToRegister.push(cldrData);
          } catch {
            // Ignore directories that don't contain a numbers.json file
          }
        }
      }

      this.registerFromCLDR(localesToRegister);
    } catch (error) {
      throw new CompactNumberError(
        'registerFullCLDR() is only supported in a Node.js environment and requires the "cldr-numbers-full" package to be installed.'
      );
    }
  }

  /**
   * Registers one or more pre-formatted locale data objects with the store.
   * Existing locales with the same normalized key will be overwritten.
   * @param localeData A single LocaleData object or an array of LocaleData objects to register.
   */
  public register(localeData: LocaleData | LocaleData[]): void {
    const localesToAdd = Array.isArray(localeData) ? localeData : [localeData];
    for (const data of localesToAdd) {
      for (const [key, value] of Object.entries(data)) {
        this.#locales[normalizeLocale(key)] = value;
      }
    }
  }

  /**
   * Retrieves the locale information for a given locale string.
   * If the exact locale is not found, it attempts to find a parent locale (e.g., 'en' for 'en-US').
   * @param locale The locale string to retrieve (e.g., 'en', 'es-MX').
   * @returns The Locale object if found, otherwise undefined.
   */
  public get(locale: string): Locale | undefined {
    const normalized = normalizeLocale(locale);
    const localeInfo = this.#locales[normalized];

    if (localeInfo) {
      return localeInfo;
    }

    // If not found, try to find a parent locale
    const parentLocaleKey = Object.keys(this.#locales).find((key) =>
      normalized.startsWith(`${key}-`)
    );
    if (parentLocaleKey) {
      return this.#locales[parentLocaleKey];
    }

    return undefined;
  }

  /**
   * Returns an array of all currently registered locale keys.
   * @returns An array of strings, each representing a registered locale key.
   */
  public getRegisteredLocales(): string[] {
    return Object.keys(this.#locales);
  }

  /**
   * Resets the store to its default state, containing only the 'en' locale.
   * All other registered locales will be removed.
   */
  public reset(): void {
    this.#locales = { ...defaultLocales };
  }
}

export const store = new LocaleStore();
