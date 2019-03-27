const jsdom = require('jsdom');

module.exports = {
  displayName: 'Unit tests',
  moduleNameMapper: {
    '\\.(scss)$': '<rootDir>/__mocks__/sassMock.js',
    '\\.(html)$': '<rootDir>/__mocks__/htmlMock.js',
  },
  rootDir: '.',
  testEnvironment: './cookie-test-environment.js',
  testEnvironmentOptions: {
    cookieJar: new jsdom.CookieJar(),
  },
  testMatch: [
    '<rootDir>/src/*.test.js',
  ],
};
