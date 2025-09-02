const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', './src/main.js'],
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: false,
            interpolate: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.LOG_TO_SPLUNK': JSON.stringify(process.env.LOG_TO_SPLUNK),
      'process.env.NO_BANNER': JSON.stringify(process.env.NO_BANNER),
      'process.env.POLICY_URL': JSON.stringify(process.env.POLICY_URL),
    }),
  ],
};
