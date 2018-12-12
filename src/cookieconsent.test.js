import { acceptConsent } from './cookieconsent'

test('acceptConsent function exists', () => {
  expect(acceptConsent).toBeInstanceOf(Function)
})

test('getPreferences function exists', () => {
  expect(getPreferences).toBeInstanceOf(Function)
})

test('getPreferences returns correct value', () => {
  expect(getPreferences({"necessary":true,"preferences":true,"statistics":true,"marketing":false,"version":1})).toBe(true);
})

test('togglePreferences function exists', () => {
  expect(togglePreferences).toBeInstanceOf(Function)
})

test('getStatistics function exists', () => {
  expect(getStatistics).toBeInstanceOf(Function)
})

test('getStatistics returns correct value', () => {
  expect(getStatistics({"necessary":true,"preferences":true,"statistics":true,"marketing":false,"version":1})).toBe(true);
})

test('toggleStatistics function exists', () => {
  expect(toggleStatistics).toBeInstanceOf(Function)
})

test('getMarketing function exists', () => {
  expect(getMarketing).toBeInstanceOf(Function)
})

test('getMarketing returns correct value', () => {
  expect(getMarketing({"necessary":true,"preferences":true,"statistics":true,"marketing":false,"version":1})).toBe(false);
})

test('toggleMarketing function exists', () => {
  expect(toggleMarketing).toBeInstanceOf(Function)
})

//add tests for toggling marketing
