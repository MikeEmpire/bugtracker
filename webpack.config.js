var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './src/App.js'
  ],
  "target": "web",
  output: {
    path: path.resolve(__dirname + 'static'),
    filename: 'App.js',
    publicPath: '/'
  },
  "devServer": {
    contentBase: "./src"
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.(css)$/, use: ['style-loader', 'css-loader']}
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
