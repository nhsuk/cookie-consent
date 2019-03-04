module.exports = {
  displayName: 'Unit tests',
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/__mocks__/cssMock.js',
    '\\.(html)$': '<rootDir>/__mocks__/htmlMock.js',
  },
  rootDir: '.',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/*.test.js',
  ],
};
