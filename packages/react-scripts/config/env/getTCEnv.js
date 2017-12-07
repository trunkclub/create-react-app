'use strict';

var paths = require('../paths');
var pkg = require(paths.appPackageJson);
var git = require('git-rev-sync');

var env = process.env.NODE_ENV;

// CRA assumes two environments: development or production.
// There are some scenarios where we need to explicitly know that
// we are in a staging environment.
process.env.TC_ENV = process.env.TC_ENV || env;
process.env.TC_CLIENT_APP_NAME = pkg.name;
process.env.TC_CLIENT_APP_VERSION = pkg.version;
process.env.TC_CLIENT_BUILD_COMMIT = git.long();
process.env.TC_CLIENT_BUILD_TIME = (new Date()).toISOString();
