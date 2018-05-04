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
    new webpack.DefinePlugin({'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }}),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  entry: [
    path.resolve(__dirname, 'src', 'clientMessages.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'raindropBundle.js'
  }
}
