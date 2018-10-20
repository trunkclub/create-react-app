# Upgrading to v11

_This doc assumes you have already upgraded to v10._

## Breaking Changes

[Exhaustive List](https://github.com/facebook/create-react-app/issues/5103)

### Syntax

- Decorators are no longer supported
- [Export default from](https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from) is no longer supported
- [Export Namespace From](https://babeljs.io/docs/en/babel-plugin-proposal-export-namespace-from) is no longer supported
- `.es6` files are no longer supported
- `.mjs` files are no longer supported
- Supoort for `require.ensure()` as been removed in favor of `import()`
- IE 9, 10, and 11 are no longer supported by you can opt-in. Read about it [here](https://github.com/facebook/create-react-app/issues/5103)

### Scripts

- `tcweb-build prettier` has been removed
- `tcweb-build deploy` has been removed

### Plugins

- [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
  and [lodash-webpack-plugin](https://github.com/lodash/lodash-webpack-plugin) have been removed
  - You can now safely upgrade to lodash v4
  - If you want tree-shaking advantages, you'll have to import each function manually, e.g. `import get from 'lodash/get'`
- Webpack bundle analyzer has been removed
  - If you would like insight into your build size, you can try [this](https://github.com/facebook/create-react-app/issues/3518#issue-277616195) or [this](https://www.npmjs.com/package/source-map-explorer)

### Sass

- `node-sass` is now required
  - `yarn add -D node-sasss`
- `~` prefix for package imports is no longer needed
  - `import '~@trunkclub/scss-vars'` becomes `import '@trunkclub/scss-vars'`

### Absolute Imports

- You must now define the top level directory in the `NODE_PATH` env variable
  - `touch .env`
  - In `.env`, add `NODE_PATH=src`

### Testing

- There is a [current issue](https://github.com/facebook/create-react-app/issues/5241) with using es6 compiled modules (everything in ui) in jest tests
  - You can workaround this by ignoring these packages using something like:
  ```
    "scripts": {
    ...
    "test": "tcweb-build test --transformIgnorePatterns \"node_modules/(?!(@trunkclub/thread|@trunkclub/icons))/\"",
    ...
  },
  ```
  - Read more about this solution [here](https://jestjs.io/docs/en/configuration.html#transformignorepatterns-array-string)
  - We should probably come up with a more elegant script that can take a list of these packages and generate the regex for you

## Consider Refactoring

### Svg

- You can now import svg files as react components without wrapping them yourself
- `import { ReactComponent as Logo } from './logo.svg'`

### Lodash

- Upgrade to v4 if you can
- Check

### Babel Macros

- Babel macros are now supported, consider adding some to enrich the development experience of your application

### Testing

- We are now using jest v23, so any weird workarounds/hacks in place can probably be fixed
- `jsdom` is now the default jest environment, so you no longer have to add `--env=jsdom` to your test command
