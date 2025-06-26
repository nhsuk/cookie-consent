const jsdom = require("jsdom");

module.exports = {
  displayName: "Unit tests",
  moduleNameMapper: {
    "\\.(html)$": "<rootDir>/__mocks__/htmlMock.js",
    "\\.(scss)$": "<rootDir>/__mocks__/sassMock.js",
  },
  rootDir: ".",
  testEnvironment: "./cookie-test-environment.js",
  testEnvironmentOptions: {
    cookieJar: new jsdom.CookieJar(),
    // Set a url with a path so we can write cookie tests that use paths.
    url: "http://localhost/path1/path2/path3/",
  },
  testMatch: ["<rootDir>/src/*.test.js"],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
