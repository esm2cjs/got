# @esm2cjs/got

This is a fork of https://github.com/sindresorhus/got, but automatically patched to support ESM **and** CommonJS, unlike the original repository.

## Install

You can use an npm alias to install this package under the original name:

```
npm i got@npm:@esm2cjs/got
```

```jsonc
// package.json
"dependencies": {
    "got": "npm:@esm2cjs/got"
}
```

but `npm` might dedupe this incorrectly when other packages depend on the replaced package. If you can, prefer using the scoped package directly:

```
npm i @esm2cjs/got
```

```jsonc
// package.json
"dependencies": {
    "@esm2cjs/got": "^ver.si.on"
}
```

## Usage

```js
// Using ESM import syntax
import got from "@esm2cjs/got";

// Using CommonJS require()
const got = require("@esm2cjs/got").default;
```

> **Note:**
> Because the original module uses `export default`, you need to append `.default` to the `require()` call.

For more details, please see the original [repository](https://github.com/sindresorhus/got).

## Sponsoring

To support my efforts in maintaining the ESM/CommonJS hybrid, please sponsor [here](https://github.com/sponsors/AlCalzone).

To support the original author of the module, please sponsor [here](https://github.com/sindresorhus/got).
