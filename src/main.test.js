/* global expect */
 

import * as api from './main';

test('getPreferences function exists', () => {
  expect(api.getPreferences).toBeInstanceOf(Function);
});

test('setPreferences function exists', () => {
  expect(api.setPreferences).toBeInstanceOf(Function);
});

test('setPreferences sets the prefrences consent', () => {
  api.setPreferences(true);
  expect(api.getPreferences()).toBe(true);
  api.setPreferences(false);
  expect(api.getPreferences()).toBe(false);
});

test('getStatistics function exists', () => {
  expect(api.getStatistics).toBeInstanceOf(Function);
});

test('setStatistics function exists', () => {
  expect(api.setStatistics).toBeInstanceOf(Function);
});

test('setStatistics sets the statistics consent', () => {
  api.setStatistics(true);
  expect(api.getStatistics()).toBe(true);
  api.setStatistics(false);
  expect(api.getStatistics()).toBe(false);
});

test('getMarketing function exists', () => {
  expect(api.getMarketing).toBeInstanceOf(Function);
});

test('setMarketing function exists', () => {
  expect(api.setMarketing).toBeInstanceOf(Function);
});

test('setMarketing sets the marketing consent', () => {
  api.setMarketing(true);
  expect(api.getMarketing()).toBe(true);
  api.setMarketing(false);
  expect(api.getMarketing()).toBe(false);
});

test('getConsented function exists', () => {
  expect(api.getConsented).toBeInstanceOf(Function);
}
);  
test('setConsented function exists', () => {
  expect(api.setConsented).toBeInstanceOf(Function);
});
test('setConsented sets the correct consented value', () => {
  api.setConsented(true);
  expect(api.getConsented()).toBe(true);
  api.setConsented(false);
  expect(api.getConsented()).toBe(false);
});

test('Javascript API is exposed on window.NHSCookieConsent', () => {
  expect(window.NHSCookieConsent).toBeInstanceOf(Object);
});
