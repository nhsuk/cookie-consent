/* eslint-disable prefer-arrow-callback */
import { getCookie as getRawCookie, createCookie as createRawCookie } from './cookies';
import { insertCookieBanner, hideCookieModal, showCookieConfirmation } from './modal';
import { enableScriptsByCategory, enableIframesByCategory } from './enable';
import packageJson from '../package.json';

/**
 * If cookie rules/regulations change and the cookie itself needs to change,
 * bump this version up afterwards. It will then give the user the banner again
 * to consent to the new rules
 */
export const COOKIE_VERSION = 1;
const COOKIE_NAME = 'nhsuk-cookie-consent';

/**
 * enum for different types of cookie.
 * LONG - a long lasting cookie
 * SESSION - a cookie that should expire after the current session
 */
const COOKIE_TYPE = {
  LONG: 'long',
  SESSION: 'session',
};

/* eslint-disable sort-keys */
// Pre-defined cookie types in line with cookiebot categories
const defaultConsent = {
  necessary: true,
  preferences: true,
  statistics: true,
  marketing: false,
  version: COOKIE_VERSION,
  consented: false,
};
/* eslint-enable sort-key */

/**
 * Get the consent cookie and parse it into an object
 */
function getCookie() {
  const rawCookie = getRawCookie(COOKIE_NAME);
  return JSON.parse(rawCookie);
}

/**
 * Set the consent cookie, turning the value object into a string
 * Creates a new cookie or replaces a cookie if one exists with the same name
 */
function createCookie(value, days, path, domain, secure) {
  const stringValue = JSON.stringify(value);
  return createRawCookie(COOKIE_NAME, stringValue, days, path, domain, secure);
}

/**
 * returns an object containing consent boolean values for each consent type
 */
function getConsent() {
  const cookieValue = getCookie();
  if (!cookieValue) {
    return {};
  }
  delete cookieValue.version;
  return cookieValue;
}

/**
 * Create the consent cookie.
 * `consent` is an object of key/boolean pairs
 * e.g { marketing: false, statistics: true }
 *
 * `mode` is a COOKIE_TYPE const e.g COOKIE_TYPE.SESSION.
 * Defaults to COOKIE_TYPE.LONG
 *
 * This function will respect any consent settings that already exist in a cookie,
 * using keys defined in the `consent` object to overwrite the consent.
 */
function setConsent(consent, mode = COOKIE_TYPE.LONG) {
  const path = '/';

  let days;
  // default cookie mode is COOKIE_TYPE.LONG
  if (mode === COOKIE_TYPE.LONG) {
    days = 365;
  } else if (mode === COOKIE_TYPE.SESSION || !mode) {
    days = null;
  } else {
    // cookie mode not recognised
    throw new Error(`Cookie mode ${mode} not recognised`);
  }

  const existingConsent = getConsent();

  const cookieValue = {
    // merge the consent that already exists with the new consent setting
    ...existingConsent,
    ...consent,
    // add version information to the cookie consent settings
    version: COOKIE_VERSION,
  };

  createCookie(cookieValue, days, path);
}

function getUserCookieVersion() {
  const cookie = getCookie();
  return cookie.version;
}

function isValidVersion() {
  return getUserCookieVersion() >= COOKIE_VERSION;
}

// N.B document.currentScript needs to be executed outside of any callbacks
// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript#Notes
const scriptTag = document.currentScript;

/**
 * Get properties from the script tag that is including this javascript
 */
function getScriptSettings() {
  const defaults = {
    nobanner: false,
  };
  if (!scriptTag) {
    return defaults;
  }

  const dataNobanner = scriptTag.getAttribute('data-nobanner');

  // overwrite the default settings with attributes found on the <script> tag
  return {
    ...defaults,
    nobanner: dataNobanner === 'true' || dataNobanner === '',
  };
}

function getConsentSetting(key) {
  const cookie = getConsent();
  // double ! to convert truthy/falsy values into true/false
  return !!cookie[key];
}

function getPreferences() {
  return getConsentSetting('preferences');
}

function getStatistics() {
  return getConsentSetting('statistics');
}

function getMarketing() {
  return getConsentSetting('marketing');
}

function getConsented() {
  return getConsentSetting('consented');
}

function togglePreferences() {
  setConsent({ preferences: !getPreferences() });
}

export function toggleConsented() {
  const cookie = getCookie();
  cookie.consented = !cookie.consented;
  createCookie(cookie, 365, '/');
}

function toggleStatistics() {
  setConsent({ statistics: !getStatistics() });
}

function toggleMarketing() {
  setConsent({ marketing: !getMarketing() });
}

// If consent is given, change value of cookie
export function acceptConsent() {
  hideCookieModal();
  showCookieConfirmation();
}

/*
 * Set the global NHSCookieConsent object that implementors of this library
 * will interact with.
 */
window.NHSCookieConsent = {
  /*
   * The version of this package as defined in the package.json
   */
  VERSION: packageJson.version,

  getPreferences,
  getStatistics,
  getMarketing,
  getConsented,
  togglePreferences,
  toggleStatistics,
  toggleMarketing,
  toggleConsented,
};

window.addEventListener('load', function checkCookie() {
  // If there isn't a user cookie, create one
  if (getCookie() == null) {
    createCookie(cookieTypes, 365, '/');
    insertCookieBanner(acceptConsent);
  } else if (!isValidVersion(COOKIE_VERSION)) {
    createCookie(cookieTypes, 365, '/');
    insertCookieBanner(acceptConsent);
  } else if (getCookie(COOKIE_NAME).consented == false) {
    insertCookieBanner(acceptConsent);
  }

  if (getStatistics() === true) {
    enableScriptsByCategory('statistics');
    enableIframesByCategory('statistics');
  }
  if (getPreferences() === true) {
    enableScriptsByCategory('preferences');
    enableIframesByCategory('preferences');
  }
  if (getMarketing() === true) {
    enableScriptsByCategory('marketing');
    enableIframesByCategory('marketing');
  }
});
