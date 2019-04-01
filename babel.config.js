module.exports = {
  plugins: ['babel-plugin-rewire'],
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
  ],
};
