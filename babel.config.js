module.exports = (api) => {
  const isTest = api.env('test');

  let targets = {};
  let plugins = [];

  if (isTest) {
    // Add node to babel targets when running tests
    targets = {
      ...targets,
      node: 'current',
    };

    // Add rewire for jest unit tests
    plugins = [
      ...plugins,
      'babel-plugin-rewire',
    ];
  }

  const config = {
    plugins,
    presets: [
      ['@babel/preset-env', { targets }],
    ],
  };

  return config;
};
