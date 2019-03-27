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
  // Set a url with a path so we can write cookie tests that use paths.
  testURL: 'http://localhost/path1/path2/path3/',
};
