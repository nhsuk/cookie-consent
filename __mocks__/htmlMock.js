// Mock for the html-loader.
// In jest unit tests, all import ... from 'html-loader!./file.html' statements
// will return a simple html string:

module.exports = '<div><p>Mock HTML</p></html>';
