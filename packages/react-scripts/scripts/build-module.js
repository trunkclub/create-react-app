'use strict';

const args = process.argv.slice(2);
const isWatch = args.indexOf('-w') !== -1 || args.indexOf('--watch') !== -1
const shouldClean = args.indexOf('--clean') !== -1
const outDirIdx = args.indexOf('-d') !== -1
  ? args.indexOf('-d')
  : args.indexOf('--out-dir')

const envFallback = isWatch ? 'development' : 'production'
process.env.NODE_ENV = process.env.NODE_ENV || envFallback

require('../config/env');

const path = require('path');
const fs = require('fs-extra');
const walkSync = require('klaw-sync');
const chokidar = require('chokidar');
const transformFileSync = require('babel-core').transformFileSync;
const spawn = require('cross-spawn');
const paths = require('../config/paths');
const chalk = require('chalk')

const assetFileRegex = /\.(s?css|svg|json|ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/

function lint () {
  return spawn.sync('node', [require.resolve('./lint')], {stdio: 'inherit'});
}

function fancyLog (color, label, fileName, src, dest) {
  console.log(
    color.bgBlack(label),
    '[' + chalk.green(fileName) + ']',
    chalk.gray(src + ' -> ' + dest)
  );
}

function transformWithBabel (filePath) {
  const srcFile = path.join(paths.appSrc, filePath);
  const { code } = transformFileSync(srcFile, {
    ast: false,
    sourceMaps: 'inline',
    presets: [
      require.resolve('babel-preset-trunkclub'),
    ],
    plugins: [
      [require.resolve('babel-plugin-module-resolver'), {
        root: [paths.appSrc],
      }]
    ],
  });
  const outputFilePath =
    path.join(paths.appBuild,
              path.join(path.dirname(filePath),
                        path.basename(filePath, path.extname(filePath)) + '.js'))
  // Write the transpiled file
  fs.writeFileSync(outputFilePath, code);
  fancyLog(chalk.cyan, 'BABEL', filePath, srcFile, outputFilePath)
  // Copy the source file as a Flow declaration file
  const  outputFlowFilePath = outputFilePath + '.flow'
  fs.copySync(srcFile, outputFlowFilePath)
  fancyLog(chalk.yellow, 'FLOW', filePath + '.flow', srcFile, outputFlowFilePath)
  return outputFilePath
}

function copyAsset (filePath) {
  const srcFile = path.join(paths.appSrc, filePath)
  const destFile = path.join(paths.appBuild, filePath)
  fs.copySync(srcFile, destFile)
  fancyLog(chalk.magenta, 'COPY', filePath, srcFile, destFile)
}

function processFile (filePath) {
  if (/\.(es6|jsx?)$/.test(filePath)) {
    fs.mkdirpSync(path.parse(path.join(paths.appBuild, filePath)).dir);
    return transformWithBabel(filePath);
  }
  if (assetFileRegex.test(filePath)) {
    fs.mkdirpSync(path.parse(path.join(paths.appBuild, filePath)).dir);
    return copyAsset(filePath)
  }
}


if (outDirIdx !== -1) {
  paths.appBuild = path.resolve(paths.appBuild, '..', args[outDirIdx + 1])
}

// Clear previous build artifacts before we start
if (shouldClean) {
  fs.removeSync(paths.appBuild);
}

const result = lint();
walkSync(paths.appSrc).map(({ path }) => path).forEach(function (filePath) {
  processFile(path.relative(paths.appSrc, filePath));
});

if (!isWatch) {
  process.exit(result.status);
}

const watcher = chokidar.watch([
  '**/*.*'
], {
  cwd: paths.appSrc,
  persistent: true,
  ignoreInitial: true
})

watcher.on('all', function (event, filePath) {
  if (event === 'add' || event === 'change') {
    lint();
    processFile(filePath);
  }
})
