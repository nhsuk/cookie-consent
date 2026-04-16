/* global expect, jest, beforeEach, afterEach */

const consent = require('../../services/consent').default;
import {
  COOKIE_NAME,
  COOKIE_VERSION,
  COOKIE_TYPE,
  getCookie,
  setConsent,
  getConsentSetting,
  setConsentSetting,
  getUserCookieVersion,
  isValidVersion,
  shouldShowBanner,
} from '../../services/consent';

describe('getCookie', () => {
  test('getCookie returns null if getRawCookie returns null', () => {
    consent.__Rewire__('getRawCookie', () => null);
    expect(getCookie()).toBe(null);
    consent.__ResetDependency__('getRawCookie');
  });

  test('getCookie returns object if getRawCookie returns json', () => {
    consent.__Rewire__('getRawCookie', () => '{"a":123, "b":456}');
    expect(getCookie()).toEqual({ a: 123, b: 456 });
    consent.__ResetDependency__('getRawCookie');
  });

  test('getCookie throws an error if getRawCookie returns invalid json', () => {
    consent.__Rewire__('getRawCookie', () => '{abc}');
    expect(() => {
      getCookie();
    }).toThrow(SyntaxError);
    consent.__ResetDependency__('getRawCookie');
  });
});

describe('createCookie', () => {
  const createCookie = consent.__get__('createCookie');

  test('createCookie calls createRawCookie', () => {
    const spy = jest.fn();
    consent.__Rewire__('createRawCookie', spy);
    createCookie({ a: 123, b: 456 }, 10, '/', 'domain', false);
    expect(spy).toHaveBeenCalledWith(
      COOKIE_NAME,
      '{"a":123,"b":456}',
      10,
      '/',
      'domain',
      false,
    );
    consent.__ResetDependency__('createRawCookie');
  });
});

describe('getConsent', () => {
  const getConsent = consent.__get__('getConsent');

  test('getConsent returns an object of consent settings', () => {
    consent.__Rewire__('getCookie', () => ({
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
    consent.__ResetDependency__('getCookie');
  });
});

describe('setConsent', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();
    consent.__Rewire__('createCookie', spy);
    consent.__Rewire__('getConsent', () => ({}));
  });

  afterEach(() => {
    consent.__ResetDependency__('createCookie');
    consent.__ResetDependency__('getConsent');
  });

  test('setConsent creates a year-long cookie containing consent settings', () => {
    setConsent({
      marketing: true,
      preferences: true,
      statistics: false,
    });
    expect(spy).toHaveBeenCalledWith(
      {
        marketing: true,
        preferences: true,
        statistics: false,
        version: COOKIE_VERSION,
      },
      90,
      '/',
    );
  });

  test('setConsent creates a session cookie containing consent settings', () => {
    setConsent(
      {
        marketing: true,
        preferences: true,
        statistics: false,
      },
      COOKIE_TYPE.SESSION,
    );
    expect(spy).toHaveBeenCalledWith(
      {
        marketing: true,
        preferences: true,
        statistics: false,
        version: COOKIE_VERSION,
      },
      undefined,
      '/',
    );
  });

  test('setConsent mixes the pre-existing consent', () => {
    consent.__Rewire__('getConsent', () => ({
      marketing: false,
      preferences: false,
      statistics: false,
    }));
    setConsent({
      marketing: true,
    });
    expect(spy).toHaveBeenCalledWith(
      {
        marketing: true,
        preferences: false,
        statistics: false,
        version: COOKIE_VERSION,
      },
      90,
      '/',
    );
    consent.__ResetDependency__('getConsent');
  });
});

test("getUserCookieVersion gets the user's cookie version", () => {
  consent.__Rewire__('getCookie', () => ({
    marketing: true,
    preferences: false,
    statistics: false,
    version: 999,
  }));
  expect(getUserCookieVersion()).toBe(999);
  consent.__ResetDependency__('getCookie');
});

describe('isValidVersion', () => {
  test('isValidVersion returns true for valid cookie version', () => {
    consent.__Rewire__('getCookie', () => ({
      marketing: true,
      preferences: false,
      statistics: false,
      version: COOKIE_VERSION + 1,
    }));
    expect(isValidVersion()).toBe(true);
    consent.__ResetDependency__('getCookie');
  });

  test('isValidVersion returns false for invalid cookie version', () => {
    consent.__Rewire__('getCookie', () => ({
      marketing: true,
      preferences: false,
      statistics: false,
      version: COOKIE_VERSION - 1,
    }));
    expect(isValidVersion()).toBe(false);
    consent.__ResetDependency__('getCookie');
  });
});

describe('getConsentSetting', () => {
  test('getConsentSetting gets consent value by key', () => {
    consent.__Rewire__('getConsent', () => ({
      marketing: true,
      preferences: false,
      statistics: false,
    }));

    const marketing = getConsentSetting('marketing');
    expect(marketing).toBe(true);

    const preferences = getConsentSetting('preferences');
    expect(preferences).toBe(false);

    consent.__ResetDependency__('getConsent');
  });
});

describe('setConsentSetting', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();
    consent.__Rewire__('setConsent', spy);
  });
  afterEach(() => {
    consent.__ResetDependency__('setConsent');
  });

  test('setConsentSetting sets consent value by key', () => {
    setConsentSetting('marketing', false);
    expect(spy).toHaveBeenCalledWith({ marketing: false }, COOKIE_TYPE.LONG);
  });

  test('setConsentSetting with false triggers cookie deletion', () => {
    const deleteCookiesSpy = jest.fn();
    consent.__Rewire__('deleteCookies', deleteCookiesSpy);
    setConsentSetting('marketing', false);
    expect(deleteCookiesSpy).toHaveBeenCalled();
    consent.__ResetDependency__('deleteCookies');
  });

  test('setConsentSetting with true does not trigger cookie deletion', () => {
    const deleteCookiesSpy = jest.fn();
    consent.__Rewire__('deleteCookies', deleteCookiesSpy);
    setConsentSetting('marketing', true);
    expect(deleteCookiesSpy).not.toHaveBeenCalled();
    consent.__ResetDependency__('deleteCookies');
  });
});

describe('shouldShowBanner', () => {
  test('returns true if no cookie is found', () => {
    // tests are run in new browser context, no cookie is set yet.
    expect(shouldShowBanner()).toBe(true);
  });

  test('returns true if cookie version is out of date', () => {
    consent.__Rewire__('getCookie', () => ({
      version: COOKIE_VERSION - 1,
    }));
    expect(shouldShowBanner()).toBe(true);
    consent.__ResetDependency__('getCookie');
  });

  test('returns true if cookie does not have "active" consent', () => {
    consent.__Rewire__('getCookie', () => ({
      consented: false,
      version: COOKIE_VERSION,
    }));
    expect(shouldShowBanner()).toBe(true);
    consent.__ResetDependency__('getCookie');
  });

  test('returns false if cookie is up-to-date', () => {
    consent.__Rewire__('getCookie', () => ({
      consented: true,
      version: COOKIE_VERSION,
    }));
    expect(shouldShowBanner()).toBe(false);
    consent.__ResetDependency__('getCookie');
  });
});

describe('shouldShowBanner with nobanner', () => {
  beforeEach(() => {
    consent.__Rewire__('getNoBanner', () => true);
  });
  afterEach(() => {
    consent.__ResetDependency__('getNoBanner');
  });

  test('If nobanner setting is used, never show the banner', () => {
    expect(shouldShowBanner()).toBe(false);
  });
});
