# Upgrading to v9

*This doc assumes you have already upgraded to v8.*

**TOC**

- [Build Errors](#build-errors)
  - [Module not found](#module-not-found)
  - [TypeError: Cannot read property 'request' of undefined](#typeerror-cannot-read-property-request-of-undefined)
  - [Module build failed: Unclosed bracket](#module-build-failed-unclosed-bracket)
- [Runtime Errors](#runtime-errors)
  - [Cannot assign to read only property 'exports' of object](#cannot-assign-to-read-only-property-exports-of-object)
- [Testing Errors](#testing-errors)
  - [Failing Snapshots](#failing-snapshots)
  - [Jest Fails to Run Due to a TypeError for Path](#jest-fails-to-run-due-to-a-typeerror-for-path)

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

### TypeError: Cannot read property 'request' of undefined

Sometimes this can be fixed by nuking the node_modules folder with `rm -rf node_modules`
and reinstalling with `yarn` or `npm install`.

If that doesn't work, there might be a loader dependency that is declared at the app-level
which is not compatible with webpack 2.

### Module build failed: Unclosed bracket

You may encounter a Sass error similar to the following:

```
Failed to compile.

./src/scss/main.scss
Module build failed: Unclosed bracket (105:2)

  103 |           transform: translate(-50%, -50%); }
  104 |
> 105 | .u-zIndex-highest {
      |  ^
  106 |   z-index: 99999 !important; }
  107 |
  108 | .u-colorCopper {
```

In this instance, one of the CSS compilers is struggling with `calc()` statements that are calculating static values, such as:

```scss
.classname {
  height: calc(100% / 2);
  width: calc(100% / 2 - 10px);
}
```

To fix it, update your `calc()` statements to use either:

- Actual values
- Sass interpolation

The actual value is fine if the math is simple:

```diff
 .classname {
-  height: calc(100% / 2);
+  height: 50%;
-  width: calc(100% / 2 - 10px);
+  width: calc(50% - 10px);
 }
```

If you want to retain *how* the value was computed, you can use Sass interpolation:

```diff
 .classname {
-  height: calc(100% / 2);
+  height: #{(100% / 2)};
-  width: calc(100% / 2 - 10px);
+  width: calc(#{(100% / 2)} - 10px);
 }
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

### Failing Snapshots

Jest updated the format of snapshots, so you may have a lot of failing snapshot tests.
In most cases, it should be safe to just update your snapshots.

### Jest Fails to Run Due to a TypeError for Path

If Jest won't even run and it complains about a expecting a string for path,
then it's likely due to multiple versions of Jest installed in `node_modules`.

Nuking your `node_modules` folder _should_ fix it.
