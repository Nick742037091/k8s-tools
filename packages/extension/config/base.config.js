const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

// TODO 修复handlebars的构建warning
//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const extensionConfig = {
  target: 'node',
  mode: 'none',

  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, '../', 'out'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: false,
  infrastructureLogging: {
    level: 'log' // enables logging required for problem matchers
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../template'),
          to: path.resolve(__dirname, '../out/template')
        }
      ]
    })
  ]
}
module.exports = extensionConfig
