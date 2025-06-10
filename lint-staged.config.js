const path = require('path');
module.exports = {
  './*.{md,json}': (filenames) => [
    `npx prettier --write -- ${filenames.join(' ')}`,
  ],

  // Python test suite
  'tests/integration/**/*.py': (filenames) => [
    `python -m black ${filenames.join(' ')}`,
    `python -m pylint --rcfile=tests/integration/.pylintrc ${filenames.join(
      ' '
    )}`,
  ],
};
