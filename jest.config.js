module.exports = {
  displayName: 'Unit tests',
  moduleNameMapper: {
    '\\.(scss)$': '<rootDir>/__mocks__/sassMock.js',
    '\\.(html)$': '<rootDir>/__mocks__/htmlMock.js',
  },
  rootDir: '.',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/*.test.js',
  ],
};
