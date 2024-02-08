/* global expect, jest, beforeEach, afterEach */
/* eslint-disable no-underscore-dangle */

import cookieconsent, { getConsentSetting, setConsentSetting, onload } from './cookieconsent';

const COOKIE_NAME = cookieconsent.__get__('COOKIE_NAME');
const COOKIE_VERSION = cookieconsent.__get__('COOKIE_VERSION');
const COOKIE_TYPE = cookieconsent.__get__('COOKIE_TYPE');

describe('getCookie', () => {
  const getCookie = cookieconsent.__get__('getCookie');

  test('getCookie returns null if getRawCookie returns null', () => {
    cookieconsent.__Rewire__('getRawCookie', () => null);
    expect(getCookie()).toBe(null);
    cookieconsent.__ResetDependency__('getRawCookie');
  });

  test('getCookie returns object if getRawCookie returns json', () => {
    cookieconsent.__Rewire__('getRawCookie', () => '{"a":123, "b":456}');
    expect(getCookie()).toEqual({ a: 123, b: 456 });
    cookieconsent.__ResetDependency__('getRawCookie');
  });

  test('getCookie returns object of default settings if getRawCookie returns invalid json', () => {
    cookieconsent.__Rewire__('getRawCookie', () => '{abc}');
    cookieconsent.__Rewire__('createCookie', () => null);
    expect(getCookie()).toEqual({
      consented: false,
      marketing: false,
      necessary: true,
      preferences: false,
      statistics: false,
      version: 4,
    });
    cookieconsent.__ResetDependency__('getRawCookie');
    cookieconsent.__ResetDependency__('createCookie');
  });

  test('getCookie resets cookie if getRawCookie returns invalid json', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('getRawCookie', () => '{abc}');
    cookieconsent.__Rewire__('createCookie', spy);
    getCookie();
    expect(spy).toHaveBeenCalledWith({
      consented: false,
      marketing: false,
      necessary: true,
      preferences: false,
      statistics: false,
      version: 4,
    }, null, '/');
    cookieconsent.__ResetDependency__('getRawCookie');
    cookieconsent.__ResetDependency__('createCookie');
  });
});

describe('createCookie', () => {
  const createCookie = cookieconsent.__get__('createCookie');

  test('createCookie calls createRawCookie', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('createRawCookie', spy);
    createCookie({ a: 123, b: 456 }, 10, '/', 'domain', false);
    expect(spy).toHaveBeenCalledWith(COOKIE_NAME, '{"a":123,"b":456}', 10, '/', 'domain', false);
    cookieconsent.__ResetDependency__('createRawCookie');
  });
});

describe('getConsent', () => {
  const getConsent = cookieconsent.__get__('getConsent');

  test('getConsent returns an object of consent settings', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      marketing: true,
      preferences: true,
      statistics: false,
      version: 1,
    }));
    expect(getConsent()).toEqual({
      marketing: true,
      preferences: true,
      statistics: false,
    });
    cookieconsent.__ResetDependency__('getCookie');
  });
});

describe('setConsent', () => {
  const setConsent = cookieconsent.__get__('setConsent');
  let spy;

  beforeEach(() => {
    spy = jest.fn();
    cookieconsent.__Rewire__('createCookie', spy);
  });

  afterEach(() => {
    cookieconsent.__ResetDependency__('createCookie');
  });

  test('setConsent creates a year-long cookie containing consent settings', () => {
    setConsent({
      marketing: true,
      preferences: true,
      statistics: false,
    });
    expect(spy).toHaveBeenCalledWith({
      marketing: true,
      preferences: true,
      statistics: false,
      version: COOKIE_VERSION,
    }, 90, '/');
  });

  test('setConsent creates a session cookie containing consent settings', () => {
    setConsent({
      marketing: true,
      preferences: true,
      statistics: false,
    }, COOKIE_TYPE.SESSION);
    expect(spy).toHaveBeenCalledWith({
      marketing: true,
      preferences: true,
      statistics: false,
      version: COOKIE_VERSION,
    }, null, '/');
  });

  test('setConsent mixes the pre-existing consent', () => {
    cookieconsent.__Rewire__('getConsent', () => ({
      marketing: false,
      preferences: false,
      statistics: false,
    }));
    setConsent({
      marketing: true,
    });
    expect(spy).toHaveBeenCalledWith({
      marketing: true,
      preferences: false,
      statistics: false,
      version: COOKIE_VERSION,
    }, 90, '/');
    cookieconsent.__ResetDependency__('getConsent');
  });
});

test('getUserCookieVersion gets the user\'s cookie version', () => {
  cookieconsent.__Rewire__('getCookie', () => ({
    marketing: true,
    preferences: false,
    statistics: false,
    version: 999,
  }));
  const getUserCookieVersion = cookieconsent.__get__('getUserCookieVersion');
  expect(getUserCookieVersion()).toBe(999);
  cookieconsent.__ResetDependency__('getCookie');
});

describe('isValidVersion', () => {
  const isValidVersion = cookieconsent.__get__('isValidVersion');

  test('isValidVersion returns true for valid cookie version', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      marketing: true,
      preferences: false,
      statistics: false,
      version: COOKIE_VERSION + 1,
    }));
    expect(isValidVersion()).toBe(true);
    cookieconsent.__ResetDependency__('getCookie');
  });

  test('isValidVersion returns false for invalid cookie version', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      marketing: true,
      preferences: false,
      statistics: false,
      version: COOKIE_VERSION - 1,
    }));
    expect(isValidVersion()).toBe(false);
    cookieconsent.__ResetDependency__('getCookie');
  });
});

describe('getConsentSetting', () => {
  test('getConsentSetting gets consent value by key', () => {
    cookieconsent.__Rewire__('getConsent', () => ({
      marketing: true,
      preferences: false,
      statistics: false,
    }));

    const marketing = getConsentSetting('marketing');
    expect(marketing).toBe(true);

    const preferences = getConsentSetting('preferences');
    expect(preferences).toBe(false);

    cookieconsent.__ResetDependency__('getConsent');
  });
});

describe('setConsentSetting', () => {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
    cookieconsent.__Rewire__('setConsent', spy);
  });
  afterEach(() => {
    cookieconsent.__ResetDependency__('setConsent');
  });

  test('setConsentSetting sets consent value by key', () => {
    setConsentSetting('marketing', false);
    expect(spy).toHaveBeenCalledWith({ marketing: false });
  });

  test('setConsentSetting converts value to boolean', () => {
    setConsentSetting('marketing', 1);
    expect(spy).toHaveBeenCalledWith({ marketing: true });
  });

  test('setConsentSetting with false triggers cookie deletion', () => {
    const deleteCookiesSpy = jest.fn();
    cookieconsent.__Rewire__('deleteCookies', deleteCookiesSpy);
    setConsentSetting('marketing', false);
    expect(deleteCookiesSpy).toHaveBeenCalled();
    cookieconsent.__ResetDependency__('deleteCookies');
  });

  test('setConsentSetting with true does not trigger cookie deletion', () => {
    const deleteCookiesSpy = jest.fn();
    cookieconsent.__Rewire__('deleteCookies', deleteCookiesSpy);
    setConsentSetting('marketing', true);
    expect(deleteCookiesSpy).not.toHaveBeenCalled();
    cookieconsent.__ResetDependency__('deleteCookies');
  });
});

describe('shouldShowBanner', () => {
  const shouldShowBanner = cookieconsent.__get__('shouldShowBanner');

  test('returns true if no cookie is found', () => {
    // tests are run in new browser context, no cookie is set yet.
    expect(shouldShowBanner()).toBe(true);
  });

  test('returns true if cookie version is out of date', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      version: COOKIE_VERSION - 1,
    }));
    expect(shouldShowBanner()).toBe(true);
    cookieconsent.__ResetDependency__('getCookie');
  });

  test('returns true if cookie does not have "active" consent', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      consented: false,
      version: COOKIE_VERSION,
    }));
    expect(shouldShowBanner()).toBe(true);
    cookieconsent.__ResetDependency__('getCookie');
  });

  test('returns false if cookie is up-to-date', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      consented: true,
      version: COOKIE_VERSION,
    }));
    expect(shouldShowBanner()).toBe(false);
    cookieconsent.__ResetDependency__('getCookie');
  });

  test('returns false if we are on policy page', () => {
    cookieconsent.__Rewire__('getPolicyUrl', () => '/path1/path2/path3/');
    expect(shouldShowBanner()).toBe(false);
    cookieconsent.__ResetDependency__('getPolicyUrl');
  });

  test('returns false if we are on policy page configured with absolute URL', () => {
    cookieconsent.__Rewire__('getPolicyUrl', () => 'http://localhost/path1/path2/path3/');
    expect(shouldShowBanner()).toBe(false);
    cookieconsent.__ResetDependency__('getPolicyUrl');
  });
});

describe('onload', () => {
  const acceptConsent = cookieconsent.__get__('acceptConsent');
  const acceptAnalyticsConsent = cookieconsent.__get__('acceptAnalyticsConsent');
  const hitLoggingUrl = cookieconsent.__get__('hitLoggingUrl');
  const defaultConsent = cookieconsent.__get__('defaultConsent');

  beforeEach(() => {
    cookieconsent.__Rewire__('insertCookieBanner', () => null);
  });
  afterEach(() => {
    cookieconsent.__ResetDependency__('insertCookieBanner');
  });

  test('shows the banner with an acceptConsent, acceptAnalyticsConsent and hitLoggingUrl callbacks', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('insertCookieBanner', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(acceptConsent, acceptAnalyticsConsent, hitLoggingUrl);
    cookieconsent.__ResetDependency__('insertCookieBanner');
  });

  test('creates a default cookie if needed', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('getCookie', () => null);
    cookieconsent.__Rewire__('setConsent', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(defaultConsent, COOKIE_TYPE.SESSION);
    cookieconsent.__ResetDependency__('getCookie');
    cookieconsent.__ResetDependency__('setConsent');
  });

  test('enables the appropriate scripts', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('enableScriptsByCategories', spy);
    onload();
    expect(spy).toHaveBeenCalledWith([]);
    cookieconsent.__ResetDependency__('enableScriptsByCategories');
  });

  test('enables the appropriate iframes', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('enableIframesByCategories', spy);
    onload();
    expect(spy).toHaveBeenCalledWith([]);
    cookieconsent.__ResetDependency__('enableIframesByCategories');
  });

  test('removes cookies if consent version is out-of-date', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('deleteCookies', spy);
    cookieconsent.__Rewire__('isValidVersion', () => false);
    onload();
    expect(spy).toHaveBeenCalled();
  });

  test('does not remove cookies if no current cookie version is found', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('deleteCookies', spy);
    cookieconsent.__Rewire__('isValidVersion', () => null);
    onload();
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('NO_BANNER mode', () => {
  beforeEach(() => {
    cookieconsent.__Rewire__('NO_BANNER', true);
  });

  afterEach(() => {
    cookieconsent.__ResetDependency__('NO_BANNER');
  });

  test('does not show the banner', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('insertCookieBanner', spy);
    onload();
    expect(spy).not.toHaveBeenCalled();
    cookieconsent.__ResetDependency__('insertCookieBanner');
  });

  test('sets an implicit consent to all cookie types', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('setConsent', spy);
    onload();
    expect(spy).toHaveBeenCalledWith({
      consented: false,
      marketing: true,
      necessary: true,
      preferences: true,
      statistics: true,
    }, 'long');
    cookieconsent.__ResetDependency__('setConsent');
  });
});
