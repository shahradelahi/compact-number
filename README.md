# @se-oss/compact-number

[![CI](https://github.com/shahradelahi/compact-number/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/shahradelahi/compact-number/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@se-oss/compact-number.svg)](https://www.npmjs.com/package/@se-oss/compact-number)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](/LICENSE)
[![Install Size](https://packagephobia.com/badge?p=@se-oss/compact-number)](https://packagephobia.com/result?p=@se-oss/compact-number)

_@se-oss/compact-number_ is a lightweight, fast, and highly customizable library for compact number formatting and parsing, offering robust internationalization support.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Advanced Usage](#-advanced-usage)
- [Documentation](#-documentation)
- [Using Locales](#-using-locales)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install @se-oss/compact-number
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install @se-oss/compact-number
```

**yarn**

```bash
yarn add @se-oss/compact-number
```

</details>

## 📖 Usage

### `compactNumber`

Format a number into a compact, human-readable string.

```typescript
import { compactNumber } from '@se-oss/compact-number';

console.log('Formatting 1234:', compactNumber(1234));
// => 1.2K

console.log('Formatting 1500000:', compactNumber(1500000));
// => 1.5M

console.log(
  'Formatting -1234 with precision 2:',
  compactNumber(-1234, { maximumFractionDigits: 2 })
);
// => -1.23K
```

### `uncompactNumber`

Parse a compacted string back into a number.

```typescript
import { uncompactNumber } from '@se-oss/compact-number';

console.log(uncompactNumber('1.2K'));
// => 1200

console.log(uncompactNumber('1.5M'));
// => 1500000

console.log(uncompactNumber('-1.23K'));
// => -1230
```

## 💡 Advanced Usage

You can dynamically load locales from the `cldr-numbers-full` package instead of bundling them. This is useful for applications that support many languages.

First, install the CLDR data package:

```bash
pnpm add cldr-numbers-full
```

### Loading a Single Locale

To keep your bundle size small, you can import and register individual locales as needed. This works in any environment.

```typescript
import { compactNumber, store } from '@se-oss/compact-number';
// Import any CLDR locale data directly
import ca from 'cldr-numbers-full/main/ca/numbers.json';

// Register the Catalan locale from the raw CLDR data
store.registerFromCLDR(ca);

// You can now format numbers using the 'ca' locale
console.log(compactNumber(12345, { locale: 'ca' }));
// => 12,3 mil
```

### Loading All Locales (Node.js)

In Node.js environments, you can register all available CLDR locales at once using `registerFullCLDR`. This is useful for servers that need to handle many different locales.

```typescript
import { compactNumber, store } from '@se-oss/compact-number';

// Register all CLDR locales
await store.registerFullCLDR();

// Now you can format numbers in any of the registered locales
console.log(compactNumber(12345, { locale: 'ja' })); // Japanese
// => 1.2万

console.log(compactNumber(54321, { locale: 'fr' })); // French
// => 54,3 k
```

**Note:** This function only works in Node.js. It will throw an error in the browser to prevent bundling the entire `cldr-numbers-full` package.

## 🌍 Using Locales

By default, only the `en` locale is registered. To use other locales, you must import and register them. This ensures that unused locales are not included in your final bundle.

```typescript
import { compactNumber, es, store } from '@se-oss/compact-number';

// Register the Spanish (es) locale
store.register(es);

console.log(compactNumber(1234, { locale: 'es' }));
// => 1.2 mil
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/compact-number).

## 🚀 Performance

_@se-oss/compact-number_ is designed for speed. Our benchmarks show it's significantly faster than `Intl.NumberFormat` for compact number formatting.

| Library                    | Operations/second (hz) |
| :------------------------- | :--------------------- |
| `@se-oss/compact-number`   | 274,863.69             |
| `Intl.NumberFormat`        | 22,298.90              |
| **Performance Difference** | **~12.33x faster**     |

_Benchmark script: [`src/index.bench.ts`](src/index.bench.ts)_

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/compact-number)

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/compact-number/graphs/contributors).
