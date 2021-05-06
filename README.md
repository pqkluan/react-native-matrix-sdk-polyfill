# react-native-matrix-sdk-polyfill

TL;DR: Fix error + warning when `matrix-js-sdk` with `react-native`.

## How to use

### Installation

```bash
yarn add react-native-matrix-sdk-polyfill
```

Applying polyfill by import this library in your root `index.js`:

```diff
# Should be at the very first import in your project
+ import 'react-native-matrix-sdk-polyfill';

import {AppRegistry} from 'react-native';
```

`matrix-js-sdk` is declare as peer dependency so you could use any version.

### Strong typing

The official sdk come with `d.ts` file, but it very poorly type.

Installing `@types/matrix-js-sdk` is strongly recommended.

```bash
yarn add -D @types/matrix-js-sdk
```

Edit `tsconfig.json` as following to override the default types come from `matrix-js-sdk`, otherwise you will stuck with `any` client.

```diff
{
  "compilerOptions": {
+    "paths": {
+      "matrix-js-sdk": ["./node_modules/@types/matrix-js-sdk/index.d.ts"]
+    }
  }
}
```
