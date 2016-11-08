require('../utils/loadEnv');

var spawn = require('cross-spawn');

var defaults = [
  '--presets=trunkclub',
  '--source-maps'
];

var args = process.argv.slice(2).concat(defaults);

var result = spawn.sync(
  'node',
  [require.resolve('babel-cli/bin/babel.js')].concat(args),
  {stdio: 'inherit'}
);

process.exit(result.status);