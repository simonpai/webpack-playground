const pathAPI = require('path');
// const webpack = require('webpack');

module.exports = (env, argv) => ({
  mode: 'development',
  context: pathAPI.resolve(__dirname),
  entry: ['./src/polyfill', './src'],
  target: 'web',
  output: {
    path: pathAPI.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  devServer: {
    open: true,
    stats: 'minimal',
    host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: pathAPI.resolve(__dirname, 'static')
  }
});
