import { CookieJar } from 'jsdom';
import { execSync } from 'node:child_process';

const CONSENT_SCHEMA_HASH = execSync('node scripts/compute-schema-hash.js', {
  encoding: 'utf-8',
}).trim();

export const displayName = 'Unit tests';
export const globals = {
  CONSENT_SCHEMA_HASH,
};export const moduleNameMapper = {
  '\\.(html)$': '<rootDir>/__mocks__/htmlMock.js',
  '\\.(scss)$': '<rootDir>/__mocks__/sassMock.js',
};
export const rootDir = '.';
export const testEnvironment = './cookie-test-environment.js';
export const testEnvironmentOptions = {
  cookieJar: new CookieJar(),
  // Set a url with a path so we can write cookie tests that use paths.
  url: 'http://localhost/path1/path2/path3/',
};
export const testMatch = ['<rootDir>/src/__tests__/**/*.test.ts'];
export const transform = {
  '^.+.[jt]s$': 'babel-jest',
};
export const moduleFileExtensions = ['ts', 'js', 'json'];
export const clearMocks = true;
export const resetMocks = true;
export const restoreMocks = true;
