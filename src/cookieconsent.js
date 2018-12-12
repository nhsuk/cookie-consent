import { getCookie as getRawCookie, createCookie as createRawCookie } from './cookies'
import { insertCookieBanner, hideCookieModal, showCookieConfirmation } from './modal'
import { enableScriptsByCategory, enableIframesByCategory } from './enable'
import packageJson from '../package.json'

var delimiter = "---"; //used to split cookie into information

// If cookie rules/regulations change and the cookie itself needs to change, bump this version up afterwards.
// It will then give the user the banner again to consent to the new rules
export const COOKIE_VERSION = 1;
const COOKIE_NAME = 'nhsuk-cookie-consent';

var cookieTypes = {
    "necessary": true,
    "preferences": true,
    "statistics": true,
    "marketing": false,
    "version": COOKIE_VERSION,
};

function getCookie() {
  const rawCookie = getRawCookie(COOKIE_NAME)
  return JSON.parse(rawCookie)
}

function createCookie(value, days, path, domain, secure) {
  const stringValue = JSON.stringify(value)
  return createRawCookie(COOKIE_NAME, stringValue, days, path, domain, secure)
}

window.onload = function checkCookie() {
    //If there isn't a user cookie, create one
    if (getCookie() == null) {
        createCookie(cookieTypes, 365, "/");
        insertCookieBanner();
    } else if(!isValidVersion(COOKIE_NAME, COOKIE_VERSION)) {
        createCookie(cookieTypes, 365, "/");
        insertCookieBanner();
    }
}

//If consent is given, change value of cookie
export function acceptConsent() {
    // On a domain where marketing cookies are required, toggleMarketing() would go here
    hideCookieModal();
    showCookieConfirmation();
}

function getCookieVersion(name) {
  return getCookie(name).version
}

function isValidVersion(name, version) {
    if (getCookieVersion(name) <= version)
        return true;
    else
        return false;
}

export function askMeLater() {
    createCookie(COOKIE_NAME, cookieTypes, "", "/");
    hideCookieModal();
}

function getConsentSetting(key) {
  const cookie = getCookie(COOKIE_NAME)
  return cookie[key]
}

// Can use getCookie beforehand to get a cookie object from a name
function getPreferences() {
  return getConsentSetting('preferences')
};

function getStatistics() {
  return getConsentSetting('statistics')
};

function getMarketing() {
  return getConsentSetting('marketing')
};

function togglePreferences() {
  const cookie = getCookie()
  cookie.preferences = !cookie.preferences;
  createCookie(cookie, 365, "/");
};

function toggleStatistics() {
  const cookie = getCookie()
  cookie.statistics = !cookie.statistics;
  createCookie(cookie, 365, "/");
};

function toggleMarketing() {
  const cookie = getCookie()
  cookie.marketing = !cookie.marketing;
  createCookie(cookie, 365, "/");
};

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
  togglePreferences,
  toggleStatistics,
  toggleMarketing,
};
