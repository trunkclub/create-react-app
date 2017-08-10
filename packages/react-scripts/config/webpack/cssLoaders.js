'use strict';

const autoprefixer = require('autoprefixer');

module.exports = function getCSSLoaders(cssLoaderOpts) {
  return [
    {
      loader: require.resolve('css-loader'),
      options: Object.assign({}, {
        importLoaders: 2,
        sourceMap: true,
      }, (cssLoaderOpts || {})),
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
        sourceMap: true,
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
          }),
        ],
      },
    },
    {
      loader: require.resolve('sass-loader'),
      options: {
        sourceMap: true,
      },
    },
  ]
}
