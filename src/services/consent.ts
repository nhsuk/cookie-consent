import {
  getCookie as getRawCookie,
  createCookie as createRawCookie,
  deleteCookies,
} from './cookies';
import { getNoBanner } from './settings';
import { ConsentState, ConsentCookie, CookieMode } from '../types/consent';

/**
 * If cookie rules/regulations change and the cookie itself needs to change,
 * bump this version up afterwards. It will then give the user the banner again
 * to consent to the new rules
 */
export const COOKIE_VERSION = 7;
export const COOKIE_NAME = 'nhsuk-cookie-consent';

/**
 * enum for different types of cookie.
 * LONG - a long lasting cookie
 * SESSION - a cookie that should expire after the current session
 */
export const COOKIE_TYPE: { LONG: CookieMode; SESSION: CookieMode } = {
  LONG: 'long',
  SESSION: 'session',
};

// Pre-defined cookie types in line with cookiebot categories
export const defaultConsent: ConsentState = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  consented: false,
};

/**
 * Get the consent cookie and parse it into an object
 */
export function getCookie(): ConsentCookie | null {
  const rawCookie = getRawCookie(COOKIE_NAME);
  if (!rawCookie) return null;
  return JSON.parse(rawCookie);
}

/**
 * Set the consent cookie, turning the value object into a string
 * Creates a new cookie or replaces a cookie if one exists with the same name
 */
function createCookie(
  value: Record<string, unknown>,
  days: number | undefined,
  path: string,
  domain?: string,
  secure?: boolean,
): void {
  const stringValue = JSON.stringify(value);
  return createRawCookie(COOKIE_NAME, stringValue, days, path, domain, secure);
}

/**
 * returns an object containing consent boolean values for each consent type
 */
function getConsent(): Partial<ConsentState> {
  const cookieValue = getCookie();
  if (!cookieValue) {
    return {};
  }
  const { version, ...consent } = cookieValue;
  return consent;
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
export function setConsent(
  consent: Partial<ConsentState>,
  mode: CookieMode = COOKIE_TYPE.LONG,
): void {
  const path = '/';

  let days: number | undefined;
  // default cookie mode is COOKIE_TYPE.LONG
  if (mode === COOKIE_TYPE.LONG) {
    // default based on ICO guidance
    days = 90;
  } else {
    days = undefined;
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
export function getUserCookieVersion(): number | null {
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
export function isCookieConsentGiven(): boolean {
  return getConsentSetting('consented') === true;
}

/**
 * Is the cookie that is currently set on the browser valid.
 * a "valid" cookie is one which has the latest COOKIE_VERSION number.
 * Returns true/false if a cookie is found on the browser.
 * Returns null if no cookie is found.
 */
export function isValidVersion(): boolean | null {
  const currentVersion = getUserCookieVersion();
  return currentVersion === null ? null : currentVersion >= COOKIE_VERSION;
}

export function getConsentSetting(key: keyof ConsentState): boolean {
  const cookie = getConsent();
  // double ! to convert truthy/falsy values into true/false
  return !!cookie[key];
}

export function setConsentSetting(
  key: keyof ConsentState,
  value: boolean,
  mode: CookieMode = COOKIE_TYPE.LONG,
): void {
  if (!value) {
    deleteCookies(COOKIE_NAME);
  }
  // double ! to convert truthy/falsy values into true/false
  setConsent({ [key]: !!value }, mode);
}

/**
 * Should the banner be shown to a user?
 * Returns true or false
 */
export function shouldShowBanner(): boolean {
  // If the `nobanner` setting is used, never show the banner.
  if (getNoBanner()) {
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
