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

  test('getCookie throws an error if getRawCookie returns invalid json', () => {
    cookieconsent.__Rewire__('getRawCookie', () => '{abc}');
    expect(() => {
      getCookie();
    }).toThrow(SyntaxError);
    cookieconsent.__ResetDependency__('getRawCookie');
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
    }, 365, '/');
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
    }, 365, '/');
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

  test('shouldShowBanner returns true if no cookie is found', () => {
    // tests are run in new browser context, no cookie is set yet.
    expect(shouldShowBanner()).toBe(true);
  });

  test('shouldShowBanner returns true if cookie version is out of date', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      version: COOKIE_VERSION - 1,
    }));
    expect(shouldShowBanner()).toBe(true);
    cookieconsent.__ResetDependency__('getCookie');
  });

  test('shouldShowBanner returns true if cookie does not have "active" consent', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      consented: false,
      version: COOKIE_VERSION,
    }));
    expect(shouldShowBanner()).toBe(true);
    cookieconsent.__ResetDependency__('getCookie');
  });

  test('shouldShowBanner returns false if cookie is up-to-date', () => {
    cookieconsent.__Rewire__('getCookie', () => ({
      consented: true,
      version: COOKIE_VERSION,
    }));
    expect(shouldShowBanner()).toBe(false);
    cookieconsent.__ResetDependency__('getCookie');
  });
});

describe('onload', () => {
  const acceptConsent = cookieconsent.__get__('acceptConsent');
  const defaultConsent = cookieconsent.__get__('defaultConsent');

  beforeEach(() => {
    cookieconsent.__Rewire__('insertCookieBanner', () => null);
  });
  afterEach(() => {
    cookieconsent.__ResetDependency__('insertCookieBanner');
  });

  test('shows the banner with an acceptConsent callback', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('insertCookieBanner', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(acceptConsent);
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
    expect(spy).toHaveBeenCalledWith(['preferences', 'statistics']);
    cookieconsent.__ResetDependency__('enableScriptsByCategories');
  });

  test('enables the appropriate iframes', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('enableIframesByCategories', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(['preferences', 'statistics']);
    cookieconsent.__ResetDependency__('enableIframesByCategories');
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
