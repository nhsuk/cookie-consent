const path = require('node:path');
const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', './src/main.ts'],
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(ts|js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            postprocessor: (content, _loaderContext) => {
              const isTemplateLiteralSupported = content[0] === '`';
              return content
                .replaceAll('<%=', isTemplateLiteralSupported ? '${' : '" +')
                .replaceAll('%>', isTemplateLiteralSupported ? '}' : '+ "');
            },
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
    }),
  ],
};
