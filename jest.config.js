module.exports = {
  displayName: "Unit tests",
  testEnvironment: "jsdom",
  rootDir: ".",
  testMatch: [
    "<rootDir>/src/*.test.js",
  ],
  moduleNameMapper: {
    "\\.(html)$": "<rootDir>/__mocks__/htmlMock.js",
  },
}
