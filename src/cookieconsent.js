import { getCookie as getRawCookie, createCookie as createRawCookie } from './cookies';
import { insertCookieBanner } from './banner';
import { enableScriptsByCategory, enableIframesByCategory } from './enable';

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

/*
 * NO_BANNER mode means that the banner will never be shown, and users will
 * have all cookie-types activated.
 * We need this switch to be able to totally disable the functionality of this
 * cookie-consent library for a co-ordinated cross-platform release.
 */
const NO_BANNER = (process.env.NO_BANNER === 'true');

/* eslint-disable sort-keys */
// Pre-defined cookie types in line with cookiebot categories
const defaultConsent = {
  necessary: true,
  preferences: true,
  statistics: true,
  marketing: false,
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

// If consent is given, change the value of the cookie
function acceptConsent() {
  // On a domain where marketing cookies are required, toggleMarketing() would go here
  setConsent({
    ...defaultConsent,
    consented: true,
  });
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

export function getConsentSetting(key) {
  const cookie = getConsent();
  // double ! to convert truthy/falsy values into true/false
  return !!cookie[key];
}

export function setConsentSetting(key, value) {
  // double ! to convert truthy/falsy values into true/false
  setConsent({ [key]: !!value });
}

/**
 * Should the banner be shown to a user?
 * Returns true or false
 */
function shouldShowBanner() {
  // If the `nobanner` setting is used, never show the banner.
  const settings = getScriptSettings();
  if (settings.nobanner) {
    return false;
  }

  // Show the banner if there is no cookie. This user is a first-time visitor
  if (getCookie() === null) {
    return true;
  }

  // Show the banner if the user has consented before, but on an old version
  if (!isValidVersion(COOKIE_VERSION)) {
    return true;
  }

  // Show the banner if the user has a cookie, but didn't actively consent.
  // For example, they didn't interact with the banner on a previous visit.
  if (getConsentSetting('consented') === false) {
    return true;
  }

  return false;
}

/*
 * function that needs to fire when every page loads.
 * - shows the cookie banner
 * - sets default consent
 * - enables scripts and iframes depending on the consent
 */
export function onload() {
  if (shouldShowBanner()) {
    if (NO_BANNER) {
      // If NO_BANNER mode, we need to set "implied consent" to every cookie type
      setConsent({
        necessary: true,
        preferences: true,
        statistics: true,
        marketing: true,
        consented: false,
      },
      COOKIE_TYPE.LONG);
    } else {
      insertCookieBanner(acceptConsent);
    }
  }

  // If there isn't a valid user cookie, create one with default consent
  if (getCookie() === null || !isValidVersion(COOKIE_VERSION)) {
    setConsent(defaultConsent, COOKIE_TYPE.SESSION);
  }

  // For each type, check the consent setting and enable the appropriate scripts and iframes
  ['statistics', 'preferences', 'marketing'].forEach((cookieCategory) => {
    if (getConsentSetting(cookieCategory) === true) {
      enableScriptsByCategory(cookieCategory);
      enableIframesByCategory(cookieCategory);
    }
  });
}
