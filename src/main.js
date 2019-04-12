import { getConsentSetting, setConsentSetting, onload } from './cookieconsent';
import { version } from '../package.json';

export const VERSION = version;

export function getPreferences() {
  return getConsentSetting('preferences');
}

export function getStatistics() {
  return getConsentSetting('statistics');
}

export function getMarketing() {
  return getConsentSetting('marketing');
}

export function getConsented() {
  return getConsentSetting('consented');
}

export function setPreferences(value) {
  setConsentSetting('preferences', value);
}

export function setStatistics(value) {
  setConsentSetting('statistics', value);
}

export function setMarketing(value) {
  setConsentSetting('marketing', value);
}

export function setConsented(value) {
  setConsentSetting('consented', value);
}

/**
 * Set the global NHSCookieConsent object that implementors of this library
 * will interact with.
 */
/* eslint-disable sort-keys */
window.NHSCookieConsent = {
  /*
   * The version of this package as defined in the package.json
   */
  VERSION,

  getPreferences,
  getStatistics,
  getMarketing,
  getConsented,

  setPreferences,
  setStatistics,
  setMarketing,
  setConsented,
};
/* eslint-enable sort-keys */

window.addEventListener('load', onload);
