const pathAPI = require('path');
const webpack = require('webpack');
const NoEmitPlugin = require('no-emit-webpack-plugin');
const {promisify, percent} = require('./util');

const webpack$ = promisify(webpack);
const webpackRoot = pathAPI.resolve(__dirname, '../node_modules/webpack');

const baseConfig = {
  mode: 'development',
  target: 'node',
  profile: true,
  plugins: [
    new NoEmitPlugin()
  ]
};

const webpackConfig = Object.assign({
  entry: pathAPI.resolve(webpackRoot, 'lib/webpack.js')
}, baseConfig);

const WEBPACK_LIBS = new Set([
  'webpack',
  'enhanced-resolve',
  'watchpack',
  'webpack-sources',
  'source-list-map',
  'tapable',
  'loader-runner',
  'loader-utils',
  'schema-utils'
]);

function classify(m) {
  const segs = m.segs;
  switch (segs[0]) {
  case 'webpack':
    return classifyWebpack(m);
  case 'webpack-cli':
    return 'highlevel';
  case 'webpack-dev-server':
  case 'webpack-dev-middleware':
    return 'tool';
  case 'loader-utils':
  case 'schema-utils':
    return 'plugin';
  default:
    return 'core';
  }
}

function classifyWebpack(m) {
  const segs = m.segs;
  const filename = segs[segs.length - 1];
  if (filename.endsWith('Plugin.js')) {
    return 'plugin';
  }
  if (filename.startsWith('webpack.') || filename.startsWith('WebpackOptions')) {
    return 'highlevel';
  }
  if (segs[1] !== 'lib' || segs.length < 2) { // eslint-disable-line no-magic-numbers
    // TODO
    return 'core';
  }
  switch (segs[2]) {
  case 'performance':
  case 'wasm':
  case 'web':
  case 'webworker':
    return 'plugin';
  case 'util':
    return 'util';
  default:
    return 'core';
  }
}

const statsToJsonConfig = {
  chunks: true,
  chunkModules: true,
  source: false
};

function getModules(stats) {
  const modules = stats.toJson(statsToJsonConfig).modules;
  for (const m of modules) {
    m.segs = m.id.split('/').slice(2); // eslint-disable-line no-magic-numbers
  }
  return modules;
}

webpack$(webpackConfig)
  .then(stats => {
    const modules = getModules(stats).filter(m => WEBPACK_LIBS.has(m.segs[0]));

    const summaryHash = modules.reduce((acc, m) => {
      const type = classify(m);
      const stat = acc[type] || (acc[type] = {type: type, count: 0, size: 0});
      stat.count++;
      stat.size += m.size;
      return acc;
    }, {});
    const summaryList = Object.keys(summaryHash).map(k => summaryHash[k]);
    const summaryTotal = summaryList.reduce((acc, m) => {
      acc.count += m.count;
      acc.size += m.size;
      return acc;
    }, {count: 0, size: 0});
    for (const s of summaryList) {
      s['count%'] = percent(s.count / summaryTotal.count);
      s['size%'] = percent(s.size / summaryTotal.size);
    }
    console.log(summaryList);
  });
