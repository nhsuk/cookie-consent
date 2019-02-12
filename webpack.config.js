const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/cookieconsent.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
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
      test: /\.css$/,
      use: {
        loader: "css-loader"
      },
    }]
  }
};
