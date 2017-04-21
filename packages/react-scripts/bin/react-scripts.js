#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict'

var spawn = require('cross-spawn')
var checkNodeVersion = require('../utils/checkNodeVersion')
var script = process.argv[2]
var args = process.argv.slice(3)

checkNodeVersion(process.cwd())

function run(s) {
  switch (s) {
    case 'build':
    case 'start':
    case 'test':
    case 'build-module':
    case 'lint':
    case 'publish':
    case 'deploy':
      var result = spawn.sync(
        'node',
        [require.resolve('../scripts/' + s)].concat(args),
        { stdio: 'inherit' }
      )
      process.exit(result.status)
      break
    case 'develop':
    case 'd':
      console.log('The "' + s + '" task has been renamed to "start".')
      console.log()
      run('start')
      break
    case 'l':
      run('lint')
      break
    case 'p':
      run('publish')
      break
    case 'package-status':
    case 'ps':
      console.log(
        'The "' +
          s +
          '" task is no longer separate from the "build", "start", and "test" tasks.'
      )
      break
    case 'flow':
    case 'f':
      console.log('Flow is now part of the "lint" task. Running the linter...')
      run('lint')
      break
    default:
      console.log('Unknown script "' + script + '".')
      console.log('Perhaps you need to update @trunkclub/build?')
      break
  }
}

run(script)
