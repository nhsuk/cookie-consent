import packageJson from '../package.json';
import { getConsentSetting, setConsentSetting, onload } from './cookieconsent';

export const VERSION = packageJson.version;

export function getPreferences() {
  return getConsentSetting('preferences');
}

export function getStatistics() {
  return getConsentSetting('statistics');
}

export function getMarketing() {
  return getConsentSetting('marketing');
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

  setPreferences,
  setStatistics,
  setMarketing,
};
/* eslint-enable sort-keys */

window.addEventListener('load', onload);
