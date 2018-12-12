// Mock for the css-loader.
// In jest unit tests, all import ... from 'style.css' statements
// will return an object with a toString() method that returns a css string

module.exports = {
  toString: () => '.body { color: blue; }',
}
