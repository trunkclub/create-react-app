# Upgrading to v8

This doc assumes you have already upgraded to v7.

## Build Errors

### Module not found

You may encounter a build error about a module that isn't a dependency
of your app. Usually this means a webpack loader module was not found.

```
Failed to compile.

./src/components/SvgIcon.js
Module not found: Can't resolve 'html' in '/Users/michaellacroix/trunkclub/stylist_app/src/components'
```

Webpack 2 expects the full module name, so if there are any inline loaders
missing the `-loader` suffix then you will need to update them:

```diff
-require(`!!html!assets/svg-icons/${name}.svg`)
+require(`!!html-loader!assets/svg-icons/${name}.svg`)
```

## Runtime Errors

### Cannot assign to read only property 'exports' of object

This is caused by the mixing of ES2015 `import` statements and CommonJS `module.exports`.
These cannot be combined in webpack 2+. There error _should_ list the filename
so you might be able to search for it in your project.

More context: https://github.com/webpack/webpack/issues/4039

Update your code like the following to fix the error:

```diff
import React from 'react'

const Spinner = ...

-module.exports = Spinner
+export default Spinner
```

## Testing Errors

Jest updated the format of snapshots, so you may have a lot of failing snapshot tests.
In most cases, it should be safe to just update your snapshots.
