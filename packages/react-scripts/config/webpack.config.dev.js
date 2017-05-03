// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
// @remove-on-eject-end
'use strict';

var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('@trunkclub/react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('@trunkclub/react-dev-utils/WatchMissingNodeModulesPlugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var TrunkClubVersionsPlugin = require('../utils/trunkclub-versions-plugin');
var getClientEnvironment = require('./env');
var path = require('path');
var paths = require('./paths');

var publicUrl = 'http://localhost:' + (process.env.PORT || '3000');
var publicPath = publicUrl + '/';
var env = getClientEnvironment(publicUrl);

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  // This makes the bundle appear split into separate modules in the devtools.
  // We don't use source maps here because they can be confusing:
  // https://github.com/facebookincubator/create-react-app/issues/343#issuecomment-237241875
  // You may want 'cheap-module-source-map' instead if you prefer source maps.
  devtool: 'eval-source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('@trunkclub/react-dev-utils/webpackHotDevClient'),
    // We ship a few polyfills by default:
    require.resolve('babel-polyfill'),
    // Finally, this is your app's code:
    paths.appIndexJs
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath
  },
  resolve: {
    root: paths.appSrc,
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    // We also fallback to the app's node_modules to support hoisted modules in a
    // linked package workflow.
    fallback: [paths.appNodeModules].concat(paths.nodePaths),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx', '.es6', '.coffee', '.cjsx', ''],
    alias: {
      // This will prevent the multiple React instances issue (invariant). This mostly
      // occurs when locally linking another npm package that requires React.
      react: path.resolve(paths.appNodeModules, 'react'),
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web'
    }
  },
  resolveLoader: {
    // @remove-on-eject-begin
    // Resolve loaders (webpack plugins for CSS, images, transpilation) from the
    // directory of `react-scripts` itself rather than the project directory.
    root: paths.ownNodeModules,
    // @remove-on-eject-end
    // Fallback to any hoisted modules when dealing with linked libraries
    fallback: paths.appNodeModules
  },
  module: {
    noParse: [/\.elm$/],
    preLoaders: [
      {
        loader: 'source-map-loader',
        test: /\.(jsx?|es6)$/,
        include: function (abs) {
          const rel = path.relative(paths.appSrc, abs)
          return /@trunkclub/.test(rel)
        }
      },
      {
        loader: 'eslint-loader',
        test: /\.(jsx?|es6)$/,
        include: paths.appSrc,
      }
    ],
    loaders: [
      // ** ADDING/UPDATING LOADERS **
      // The "url" loader handles all assets unless explicitly excluded.
      // The `exclude` list *must* be updated with every change to loader extensions.
      // When adding a new loader, you must add its `test`
      // as a new entry in the `exclude` list for "url" loader.

      // "url" loader embeds assets smaller than specified size as data URLs to avoid requests.
      // Otherwise, it acts like the "file" loader.
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx|es6)$/,
          /\.s?css$/,
          /\.json$/,
          /\.coffee$/,
          /\.cjsx$/,
          /\.elm$/,
          /\.svg$/
        ],
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx|es6)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        query: {
          // @remove-on-eject-begin
          babelrc: false,
          presets: [require.resolve('babel-preset-trunkclub')],
          // @remove-on-eject-end
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true
        }
      },
      {
        test: /\.elm/,
        include: paths.appSrc,
        loader: 'elm-webpack-loader'
      },
      {
        test: /\.(coffee|cjsx)$/,
        include: paths.appSrc,
        loaders: ['coffee-loader', 'cjsx-loader']
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      // If a file is named [FILE].module.s?css instead of [FILE].s?css
      // then we will process it as a CSS Module (https://github.com/css-modules/css-modules).
      {
        test: /\.module\.s?css$/,
        loader: 'style-loader!css-loader?importLoaders=1&modules&localIdentName=[path][name]__[local]--[hash:base64:8]&sourceMap!postcss-loader!sass-loader?sourceMap'
      },
      {
        /* test: /(?<!\.module)\.s?css$/,*/
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        loader: 'style-loader!css-loader?importLoaders=1&sourceMap!postcss-loader!sass-loader?sourceMap'
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      // "file" loader for svg
      {
        test: /\.svg$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
      // ** STOP ** Are you adding a new loader?
      // Remember to add the new extension(s) to the "url" loader exclusion list.
    ]
  },
  // @remove-on-eject-begin
  // Point ESLint to our predefined config.
  eslint: {
    configFile: path.join(__dirname, '../eslintrc'),
    useEslintrc: false,
    emitWarning: true,
  },
  // @remove-on-eject-end
  // We use PostCSS for autoprefixing only.
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      }),
    ];
  },
  plugins: [
    new ProgressBarPlugin({
      summary: false
    }),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // This will add a file to the build named 'tcversions.json' to assist
    // with debugging apps that are in staging and production.
    new TrunkClubVersionsPlugin({
      packagePath: paths.appPackageJson,
      modulesPath: paths.appNodeModules,
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/en$/),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
