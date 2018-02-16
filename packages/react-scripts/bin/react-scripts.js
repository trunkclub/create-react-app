#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const spawn = require('@trunkclub/react-dev-utils/crossSpawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case 'build':
  case 'eject':
  case 'start':
  case 'build-module':
  case 'lint':
  case 'prettier':
  case 'publish':
  case 'deploy':
  case 'test': {
    const result = spawn.sync(
      'node',
      nodeArgs
        .concat(require.resolve('../scripts/' + script))
        .concat(args.slice(scriptIndex + 1)),
      { stdio: 'inherit' }
    );
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit(1);
    }
    process.exit(result.status);
    break;
  }
  case 'develop':
  case 'd':
    console.log('The "' + s + '" task has been renamed to "start".');
    console.log();
    run('start');
    break;
  case 'l':
    run('lint');
    break;
  case 'p':
    run('publish');
    break;
  case 'package-status':
  case 'ps':
    console.log(
      'The "' +
        s +
        '" task is no longer separate from the "build", "start", and "test" tasks.'
    );
    break;
  case 'flow':
  case 'f':
    console.log('Flow is now part of the "lint" task. Running the linter...');
    run('lint');
    break;
  default:
    console.log('Unknown script "' + script + '".');
    console.log('Perhaps you need to update @trunkclub/build?');
    console.log(
      'See: https://github.com/trunkclub/tcweb-build/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases'
    );
    break;
}
