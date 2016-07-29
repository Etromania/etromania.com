const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const npmCommand = process.env.npm_lifecycle_event;
const targetEnvironment = npmCommand === 'build' ? 'production' : 'development';

const entry = [
  path.join(__dirname, '/src/index.js')
];

if (targetEnvironment === 'production') {
  entry.push('webpack-dev-server/client?http://localhost:8080');
}

module.exports = {
  entry,
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.elm']
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[hash].js'
  },
  module: {
    noParse: /\.elm$/,
    loaders: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader: 'elm-webpack'
      },
      {
        test: /\.(css|sass)$/,
        loader: ExtractTextPlugin.extract('style-loader', [
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ])
      }
    ]
  },
  postcss: [
    autoprefixer({browsers: ['last 2 versions']})
  ],
  debug: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.html'),
      inject: 'body'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('./[hash].css', {allChunks: true}),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compressor: {
        warnings: false
      },
      mangle: true
    })
  ]
};
