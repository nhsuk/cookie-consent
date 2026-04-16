import { onload } from './services/consentOrchestrator';
import { getConsentSetting, setConsentSetting } from './services/consent';
import { version } from '../package.json';

const VERSION = version;

function getPreferences(): boolean {
  return getConsentSetting('preferences');
}

function getStatistics(): boolean {
  return getConsentSetting('statistics');
}

function getMarketing(): boolean {
  return getConsentSetting('marketing');
}

function getConsented(): boolean {
  return getConsentSetting('consented');
}

function setPreferences(value: boolean): void {
  setConsentSetting('preferences', value);
}

function setStatistics(value: boolean): void {
  setConsentSetting('statistics', value);
}

function setMarketing(value: boolean): void {
  setConsentSetting('marketing', value);
}

function setConsented(value: boolean): void {
  setConsentSetting('consented', value);
}

/**
 * Set the global NHSCookieConsent object that implementors of this library
 * will interact with.
 */

globalThis.NHSCookieConsent = {
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

globalThis.addEventListener('DOMContentLoaded', onload);
