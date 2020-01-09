const pathAPI = require('path');
// const webpack = require('webpack');

module.exports = (env, argv) => ({
  mode: 'development',
  devtool: false,
  context: pathAPI.resolve(__dirname),
  entry: [
    './src/polyfill',
    'demo-loader!./src'
  ],
  target: 'web',
  output: {
    path: pathAPI.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'pseudo-polyfill-loader',
        enforce: 'post'
      }
    ]
  },
  resolve: {
    alias: {
      promise: pathAPI.resolve(__dirname, 'src/polyfill/promise'),
      bluebird: 'yaku'
    }
  },
  resolveLoader: {
    modules: [
      'node_modules',
      pathAPI.resolve(__dirname, 'loader')
    ]
  },
  devServer: {
    open: true,
    stats: 'minimal',
    host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: pathAPI.resolve(__dirname, 'static')
  }
});
