'use strict';

var path = require('path');
var spawn = require('cross-spawn');

// First two args will always be:
//   - node
//   - path/to/prettier.js (this file)
var argsIndex = process.argv[2] === '--' ? 3 : 2;
var args = process.argv.slice(argsIndex);

var result = spawn.sync(
  path.resolve(__dirname, '../node_modules/.bin/prettier'),
  [
    '--single-quote',
    '--no-semi',
    '--trailing-comma', 'all',
  ].concat(args),
  { stdio: 'inherit' }
);

if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      'The prettier task failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    );
  } else if (result.signal === 'SIGTERM') {
    console.log(
      'The prettier task failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    );
  }
  process.exit(1);
}

process.exit(result.status);
