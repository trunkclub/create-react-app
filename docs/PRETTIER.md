# Prettier

## Adding Prettier to an App

Prettier is available in @trunkclub/build version 7.2 and above. It will require a
couple dependencies and a small update to the app's `package.json`.

### Dependencies

```bash
yarn add --dev lint-staged husky
```

### Configuration

Update the app's `package.json`. You will add a task to the `scripts` property,
and a new top-level property `lint-staged`:

```diff
 "scripts": {
   "start": "tcweb-build start",
   "build": "tcweb-build build",
+  "precommit": "lint-staged"
 },
```

```diff
 "scripts": {},
+"lint-staged": {
+  "src/**/*.{js,es6}": [
+    "tcweb-build prettier",
+    "git add"
+  ]
+},
 "dependencies": {},
```

### Usage

With the above configuration, Prettier will now be run on any staged source files before a commit is completed.
