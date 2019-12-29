const pathAPI = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const NoEmitPlugin = require('no-emit-webpack-plugin');

const webpackRoot = pathAPI.resolve(__dirname, '../node_modules/webpack');
// const {entry} = require('./node_modules/webpack/package.json');

const config = {
  mode: 'development',
  target: 'node',
  entry: pathAPI.resolve(webpackRoot, 'lib/webpack.js'),
  profile: true,
  plugins: [
    new NoEmitPlugin()
  ]
};

const WEBPACK_MODULE_PREFIX = './node_modules/webpack/';
// const WEBPACK_MODULE_PREFIX_LENGTH = WEBPACK_MODULE_PREFIX.length;

function reduceModuleStatsAccumulator() {
  return {
    count: 0,
    size: 0
  };
}

function reduceModuleStatsIteratee(acc, m) {
  acc.count++;
  acc.size += m.size;
  return acc;
}

function classify(m) {
  const id = m.id;
  if (id.endsWith('Plugin.js')) {
    return 'plugin';
  }
  return 'core';
}

webpack(config, (err, stats) => {
  if (err) {
    throw err;
  }
  const statsJson = stats.toJson({
    chunks: true,
    chunkModules: true,
    source: false
  });

  // all module
  const modules = _(statsJson.modules)
    .filter(m => m.id.startsWith(WEBPACK_MODULE_PREFIX))
    .value();

  const groupStats = modules.reduce((acc, m) => {
    const type = classify(m);
    const stat = acc[type] || (acc[type] = {count: 0, size: 0});
    stat.count++;
    stat.size += m.size;
    return acc;
  }, {});

  console.log(groupStats);
});
