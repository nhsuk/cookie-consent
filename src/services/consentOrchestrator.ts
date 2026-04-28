import { deleteCookies, deleteStaleSessionConsentCookies } from './cookies';
import insertCookieBanner from '../ui/banner';
import {
  enableScriptsByCategories,
  enableIframesByCategories,
} from '../utils/enable';
import { hitLoggingUrl } from './logging';
import {
  registerSharedConsentLinkHandler,
  consumeSharedConsentQuery,
} from './consentBroadcast';
import { ConsentState } from '../types/consent';
import {
  COOKIE_NAME,
  COOKIE_TYPE,
  defaultConsent,
  setConsent,
  isCookieConsentGiven,
  isValidVersion,
  isSchemaValid,
  getConsentSetting,
  shouldShowBanner,
} from './consent';
import { getNoBanner } from './settings';

function enableScriptsAndIframes(): void {
  const allCategories: (keyof ConsentState)[] = [
    'preferences',
    'statistics',
    'marketing',
  ];
  // Filter out categories that do not have user consent
  const allowedCategories = allCategories.filter(
    (category) => getConsentSetting(category) === true,
  );

  enableScriptsByCategories(allowedCategories);
  enableIframesByCategories(allowedCategories);
}

// If consent is given, change the value of the cookie
function acceptConsent(): void {
  setConsent({
    ...defaultConsent,
    consented: true,
  });
  registerSharedConsentLinkHandler(getConsentSetting);
}

// If analytics consent is given, change the value of the cookie
function acceptAnalyticsConsent(): void {
  setConsent({
    statistics: true,
    consented: true,
  });
  enableScriptsAndIframes();
  registerSharedConsentLinkHandler(getConsentSetting);
}

/*
 * function that needs to fire when every page loads.
 * - shows the cookie banner
 * - sets default consent
 * - enables scripts and iframes depending on the consent
 */
export function onload(): void {
  consumeSharedConsentQuery(
    isCookieConsentGiven,
    setConsent,
    defaultConsent,
    COOKIE_TYPE.SESSION,
  );

  if (shouldShowBanner()) {
    // clear any existing session-based stale cookies
    deleteStaleSessionConsentCookies();

    if (getNoBanner()) {
      // If NO_BANNER mode, we need to set "implied consent" to every cookie type
      setConsent(
        {
          necessary: true,
          preferences: true,
          statistics: true,
          marketing: true,
          consented: false,
        },
        COOKIE_TYPE.LONG,
      );
    } else {
      insertCookieBanner(acceptConsent, acceptAnalyticsConsent, hitLoggingUrl);
    }
  }

  // If the user has consented, register the handler for shared consent links
  if (isCookieConsentGiven()) {
    registerSharedConsentLinkHandler(getConsentSetting);
  }

  // if a cookie is set but it's invalid, clear all cookies.
  if (isValidVersion() === false || isSchemaValid() === false) {
    deleteCookies(COOKIE_NAME);
  }

  // If there isn't a valid user cookie, create one with default consent
  if (isValidVersion() !== true || isSchemaValid() === false) {
    setConsent(defaultConsent, COOKIE_TYPE.SESSION);
  }

  enableScriptsAndIframes();
}
