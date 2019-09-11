// Mock for the sass-loader.
// In jest unit tests, all import ... from 'style.scss' statements
// will return an object with a toString() method that returns a css string

module.exports = {
  toString: () => '.body { color: blue; }',
};
