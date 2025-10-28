import {
  getCookie as getRawCookie,
  createCookie as createRawCookie,
  deleteCookies,
  deleteStaleSessionConsentCookies,
} from './cookies';
import insertCookieBanner from './banner';
import { enableScriptsByCategories, enableIframesByCategories } from './enable';
import {
  getNoBanner,
  getPolicyUrl,
  makeUrlAbsolute,
  shouldBroadcastConsent,
} from './settings';

/**
 * If cookie rules/regulations change and the cookie itself needs to change,
 * bump this version up afterwards. It will then give the user the banner again
 * to consent to the new rules
 */
export const COOKIE_VERSION = 7;
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
const NO_BANNER = process.env.NO_BANNER === 'true';
const SHARED_CONSENT_QUERY = 'nhsa.sc';
const CONSENT_GIVEN = '1';
const CONSENT_NOT_GIVEN = '0';

// Pre-defined cookie types in line with cookiebot categories
const defaultConsent = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  consented: false,
};

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
    // default based on ICO guidance
    days = 90;
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

/**
 * Get the cookie version that is currently set on the browser.
 * Returns integer, or null if no cookie is set.
 */
function getUserCookieVersion() {
  const cookie = getCookie();
  return cookie === null ? null : cookie.version;
}

/**
 * Checks if the user has consented to cookies.
 *
 * This function looks at the consent settings and verifies if the 'consented' field is set to true.
 * It returns true if the user has given consent, and false otherwise.
 *
 * @returns {boolean} - Returns true if the user has consented, false otherwise.
 */
function isCookieConsentGiven() {
  return getConsentSetting('consented') === true;
}

/**
 * Is the cookie that is currently set on the browser valid.
 * a "valid" cookie is one which has the latest COOKIE_VERSION number.
 * Returns true/false if a cookie is found on the browser.
 * Returns null if no cookie is found.
 */
function isValidVersion() {
  const currentVersion = getUserCookieVersion();
  return currentVersion === null ? null : currentVersion >= COOKIE_VERSION;
}

export function getConsentSetting(key) {
  const cookie = getConsent();
  // double ! to convert truthy/falsy values into true/false
  return !!cookie[key];
}

export function setConsentSetting(key, value, mode = COOKIE_TYPE.LONG) {
  if (!value) {
    deleteCookies();
  }
  // double ! to convert truthy/falsy values into true/false
  setConsent({ [key]: !!value }, mode);
}

function enableScriptsAndIframes() {
  const allCategories = ['preferences', 'statistics', 'marketing'];
  // Filter out categories that do not have user consent
  const allowedCategories = allCategories.filter(
    (category) => getConsentSetting(category) === true
  );

  enableScriptsByCategories(allowedCategories);
  enableIframesByCategories(allowedCategories);
}

// If consent is given, change the value of the cookie
function acceptConsent() {
  setConsent({
    ...defaultConsent,
    consented: true,
  });
  registerSharedConsentLinkHandler();
}

// If analytics consent is given, change the value of the cookie
function acceptAnalyticsConsent() {
  setConsent({
    statistics: true,
    consented: true,
  });
  enableScriptsAndIframes();
  registerSharedConsentLinkHandler();
}

/**
 * Hit a URL set up to monitor logs in Splunk
 * @param {string} route route to hit for logging
 */
export function hitLoggingUrl(route) {
  if (process.env.LOG_TO_SPLUNK === 'true') {
    const oReq = new XMLHttpRequest();
    oReq.open(
      'GET',
      `https://www.nhs.uk/our-policies/cookies-policy/?policy-action=${route}`
    );
    oReq.send();
  }
}

/**
 * Should the banner be shown to a user?
 * Returns true or false
 */
function shouldShowBanner() {
  // If the `nobanner` setting is used, never show the banner.
  if (getNoBanner()) {
    return false;
  }

  // Do not show the banner if we are on the policy page.
  if (document.location.href === makeUrlAbsolute(getPolicyUrl())) {
    return false;
  }

  // Show the banner if there is no cookie. This user is a first-time visitor
  if (getCookie() === null) {
    return true;
  }

  // Show the banner if the user has consented before, but on an old version
  if (!isValidVersion()) {
    return true;
  }

  // Show the banner if the user has a cookie, but didn't actively consent.
  // For example, they didn't interact with the banner on a previous visit.
  return isCookieConsentGiven() === false;
}

/**
 * Handles click events on links and modifies the link URL based on user consent settings,
 *
 * - Modifies the link URL to include a `nhsa.sc` query parameter based on the user's
 *   consent for 'statistics'.
 * - Only processes links if the user has given consent.
 *
 * @param {Event} event - The click event object.
 */
function handleSharedConsentLinkClick(event) {
  const link = event.target.closest('a');
  if (!shouldBroadcastConsent(link)) {
    return;
  }

  const consented = getConsentSetting('consented');
  if (!consented) {
    return;
  }

  // If consented, evaluate 'statistics' consent
  const statistics = getConsentSetting('statistics');

  // Add nhsa.sc query param based on 'statistics' flag
  const linkUrl = new URL(link.href);
  linkUrl.searchParams.set(
    SHARED_CONSENT_QUERY,
    statistics ? CONSENT_GIVEN : CONSENT_NOT_GIVEN
  );
  link.href = linkUrl.href;
}

/**
 * Registers a click event listener to handle internal link clicks.
 * If a link is clicked and it's eligible, it appends a query parameter `nhsa.sc`
 * to indicate analytics consent status.
 */
function registerSharedConsentLinkHandler() {
  document.addEventListener('click', handleSharedConsentLinkClick);
}

/**
 * Processes the `shared_consent` query parameter in the current URL.
 *
 * If present and valid it will apply or override the user's "statistics" cookie consent accordingly.
 * The query parameter is then removed from the URL.
 */
function deleteSharedConsentQuery(url) {
  url.searchParams.delete(SHARED_CONSENT_QUERY);
  const relativeUrl = url.pathname + url.search + url.hash;
  window.history.replaceState({}, '', relativeUrl);
}

/**
 * Consumes the `nhsa.sc` shared consent query parameter (from the URL.
 *
 * - If the parameter is absent, nothing is done.
 * - If the parameter is invalid (not 1 or 0), it is removed without modifying cookies.
 * - If valid:
 *    - If the user has not previously consented, a new session cookie is created.
 *    - If the user has previously consented, but the value has changed, their
 *      `statistics` consent is updated and written as a session cookie.
 *
 * The query parameter is removed from the URL in all cases where it is present.
 */
function consumeSharedConsentQuery() {
  const url = new URL(window.location.href);

  // Extract the value of the 'shared consent' query parameter
  const sharedConsent = url.searchParams.get(SHARED_CONSENT_QUERY);
  if (sharedConsent === null) {
    return;
  }

  // Check if the sharedConsent value is valid
  const isValid =
    sharedConsent === CONSENT_GIVEN || sharedConsent === CONSENT_NOT_GIVEN;

  // If the value is invalid, remove the query param and exit
  if (!isValid) {
    deleteSharedConsentQuery(url);
    return;
  }

  const overrideStatsConsent = sharedConsent === CONSENT_GIVEN;
  if (!isCookieConsentGiven()) {
    // First-time consent: set statistics consent using session cookie
    setConsent(
      { ...defaultConsent, statistics: overrideStatsConsent, consented: true },
      COOKIE_TYPE.SESSION
    );
  }

  // Clean up the URL by removing the query parameter
  deleteSharedConsentQuery(url);
}

/*
 * function that needs to fire when every page loads.
 * - shows the cookie banner
 * - sets default consent
 * - enables scripts and iframes depending on the consent
 */
export function onload() {
  consumeSharedConsentQuery();

  if (shouldShowBanner()) {
    // clear any existinhg session-based stale cookies
    deleteStaleSessionConsentCookies();

    if (NO_BANNER) {
      // If NO_BANNER mode, we need to set "implied consent" to every cookie type
      setConsent(
        {
          necessary: true,
          preferences: true,
          statistics: true,
          marketing: true,
          consented: false,
        },
        COOKIE_TYPE.LONG
      );
    } else {
      insertCookieBanner(acceptConsent, acceptAnalyticsConsent, hitLoggingUrl);
    }
  }

  // If the user has consented, register the handler for shared consent links
  if (isCookieConsentGiven()) {
    registerSharedConsentLinkHandler();
  }

  // if a cookie is set but it's invalid, clear all cookies.
  if (isValidVersion() === false) {
    deleteCookies();
  }

  // If there isn't a valid user cookie, create one with default consent
  if (isValidVersion() !== true) {
    setConsent(defaultConsent, COOKIE_TYPE.SESSION);
  }

  enableScriptsAndIframes();
}
