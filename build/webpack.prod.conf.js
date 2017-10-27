var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var config = require('../config')
var baseWebpackConfig = require('./webpack.base.conf')
var cssLoaders = require('./css-loaders')

module.exports = merge(baseWebpackConfig, {
  entry: {
    app: './app/main.js'
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  vue: {
    loaders: cssLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './app/background.js', to: '.' },
      { from: './app/package.json', to: '.' },
      { from: './app/lib', to: 'lib' },
      { from: './app/assets', to: 'assets' },
      { from: './static', to: 'static' },
      { from: './app/node_modules', to: 'node_modules' }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin(path.join(config.build.assetsSubDirectory, '[name].css')),
    new HtmlWebpackPlugin({
      filename: 'main.html',
      template: './app/main.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  ]
})
