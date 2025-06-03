const baseConfig = require('./base.config')
const webpack = require('webpack')
const { merge: webpackMerge } = require('webpack-merge')

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}
module.exports = webpackMerge(baseConfig, extensionConfig)
