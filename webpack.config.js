const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './src/main.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
        options: {
          attrs: false,
        }
      }
    }, {
      test: /\.scss$/,
      use: [{
        loader: 'css-loader',
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'compressed',
        },
      }],
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NO_BANNER': JSON.stringify(process.env.NO_BANNER),
    }),
  ],
};
