const pathAPI = require('path');
const webpack = require('webpack');
const NoEmitPlugin = require('no-emit-webpack-plugin');
const {promisify, percent} = require('./util');

const webpack$ = promisify(webpack);
const webpackRoot = pathAPI.resolve(__dirname, '../node_modules/webpack');

const webpackConfig = {
  mode: 'development',
  target: 'node',
  profile: true,
  plugins: [
    new NoEmitPlugin()
  ],
  entry: [
    pathAPI.resolve(webpackRoot, 'lib/webpack.js'),
    pathAPI.resolve(webpackRoot, 'lib/webpack.web.js')
  ]
};

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

function classify(context, m) {
  const segs = m.segs;
  switch (segs[0]) {
  case 'webpack':
    return classifyWebpack(context, m);
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

function classifyWebpack(context, m) {
  const segs = m.segs;
  if (!segs) {
    console.log(m);
    return 'other';
  }
  const filename = segs[segs.length - 1];
  if (filename.endsWith('Plugin.js')) {
    return 'plugin';
  }
  if (filename.startsWith('webpack.') || filename.startsWith('WebpackOptions')) {
    return 'highlevel';
  }
  if (segs[1] !== 'lib' || segs.length < 2) { // eslint-disable-line no-magic-numbers
    return classifyByUpstream(context, m);
  }
  switch (segs[2]) {
  case 'performance':
  case 'wasm':
  case 'web':
  case 'webworker':
    return 'plugin';
  case 'util':
  default:
    return 'core';
  }
}

function classifyByUpstream(context, m) {
  const reasons = m.reasons.filter(r => r.moduleId);
  if (reasons.length !== 1) {
    return 'core'; // or util, but anyway
  }
  const upstream = context.hash[reasons[0].moduleId];
  if (!upstream) {
    console.log(m);
    return 'unknown';
  }
  return classifyWebpack(context, upstream);
}

const statsToJsonConfig = {
  chunks: true,
  chunkModules: true,
  source: false
};

function getModules(stats) {
  const modules = stats.toJson(statsToJsonConfig).modules.filter(m => m.id);
  for (const m of modules) {
    m.segs = m.id.split('/').slice(2); // eslint-disable-line no-magic-numbers
  }
  return modules;
}

webpack$(webpackConfig)
  .then(stats => {
    const modules = getModules(stats).filter(m => WEBPACK_LIBS.has(m.segs[0]));
    const moduleHash = modules.reduce((acc, m) => {
      acc[m.id] = m;
      return acc;
    }, {});
    const context = {
      hash: moduleHash
    };

    const summaryHash = modules.reduce((acc, m) => {
      const type = classify(context, m);
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
