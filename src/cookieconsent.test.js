/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */ // eslint not picking up jest expect

import cookieconsent, { acceptConsent } from './cookieconsent';

// TODO Need to test isValidVersion etc but that requires rewire

const getPreferences = cookieconsent.__get__('getPreferences');
const getStatistics = cookieconsent.__get__('getStatistics');
const getMarketing = cookieconsent.__get__('getMarketing');
const togglePreferences = cookieconsent.__get__('togglePreferences');
const toggleStatistics = cookieconsent.__get__('toggleStatistics');
const toggleMarketing = cookieconsent.__get__('toggleMarketing');

test('acceptConsent function exists', () => {
  expect(acceptConsent).toBeInstanceOf(Function);
});

test('getPreferences function exists', () => {
  expect(getPreferences).toBeInstanceOf(Function);
});

test('getPreferences returns correct value', () => {
  cookieconsent.__with__({
    getConsent: () => ({
      marketing: false,
      necessary: false,
      preferences: true,
      statistics: false,
    }),
  })(() => {
    expect(getPreferences()).toBe(true);
  });
});

test('togglePreferences function exists', () => {
  expect(togglePreferences).toBeInstanceOf(Function);
});

test('togglePreferences toggles the prefrences', () => {
  const value = getPreferences();
  togglePreferences();
  expect(getPreferences()).toBe(!value);
});

test('getStatistics function exists', () => {
  expect(getStatistics).toBeInstanceOf(Function);
});

test('getStatistics returns correct value', () => {
  cookieconsent.__with__({
    getConsent: () => ({
      marketing: false,
      necessary: false,
      preferences: false,
      statistics: true,
    }),
  })(() => {
    expect(getStatistics()).toBe(true);
  });
});

test('toggleStatistics function exists', () => {
  expect(toggleStatistics).toBeInstanceOf(Function);
});

test('getMarketing function exists', () => {
  expect(getMarketing).toBeInstanceOf(Function);
});

test('getMarketing returns correct value', () => {
  cookieconsent.__with__({
    getConsent: () => ({
      marketing: true,
      necessary: false,
      preferences: false,
      statistics: false,
    }),
  })(() => {
    expect(getMarketing()).toBe(true);
  });
});

test('toggleMarketing function exists', () => {
  expect(toggleMarketing).toBeInstanceOf(Function);
});
