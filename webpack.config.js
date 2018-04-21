const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  context: path.resolve(__dirname, 'webpack'),
  entry: [
    'webpack_exports.js'
  ],
  output: {
    path: path.resolve(__dirname, 'webpack'),
    filename: 'raindrop_bundle.js'
  }
}
