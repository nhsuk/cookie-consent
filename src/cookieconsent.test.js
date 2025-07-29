/* global expect, jest, beforeEach, afterEach */
import cookieconsent, {
  getConsentSetting,
  setConsentSetting,
  onload,
} from './cookieconsent';

const COOKIE_NAME = cookieconsent.__get__('COOKIE_NAME');
const COOKIE_VERSION = cookieconsent.__get__('COOKIE_VERSION');
const COOKIE_TYPE = cookieconsent.__get__('COOKIE_TYPE');

const defaultConsent = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  consented: false,
};

jest.mock('./banner', () => ({
  __esModule: true,
  default: jest.fn(),
}));

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
    expect(spy).toHaveBeenCalledWith(
      COOKIE_NAME,
      '{"a":123,"b":456}',
      10,
      '/',
      'domain',
      false
    );
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
    expect(spy).toHaveBeenCalledWith(
      {
        marketing: true,
        preferences: true,
        statistics: false,
        version: COOKIE_VERSION,
      },
      90,
      '/'
    );
  });

  test('setConsent creates a session cookie containing consent settings', () => {
    setConsent(
      {
        marketing: true,
        preferences: true,
        statistics: false,
      },
      COOKIE_TYPE.SESSION
    );
    expect(spy).toHaveBeenCalledWith(
      {
        marketing: true,
        preferences: true,
        statistics: false,
        version: COOKIE_VERSION,
      },
      null,
      '/'
    );
  });

  test('setConsent creates a session cookie containing consent settings when no cookie type is provided', () => {
    setConsent(
      {
        marketing: true,
        preferences: true,
        statistics: false,
      },
      null
    );
    expect(spy).toHaveBeenCalledWith(
      {
        marketing: true,
        preferences: true,
        statistics: false,
        version: COOKIE_VERSION,
      },
      null,
      '/'
    );
  });

  test('setConsent throws an error when an invalid cookie type is provided', () => {
    expect(() => {
      setConsent(
        {
          marketing: true,
          preferences: true,
          statistics: false,
        },
        'INVALID'
      );
    }).toThrow(`Cookie mode INVALID not recognised`);
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
    expect(spy).toHaveBeenCalledWith(
      {
        marketing: true,
        preferences: false,
        statistics: false,
        version: COOKIE_VERSION,
      },
      90,
      '/'
    );
    cookieconsent.__ResetDependency__('getConsent');
  });
});

test("getUserCookieVersion gets the user's cookie version", () => {
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
    expect(spy).toHaveBeenCalledWith({ marketing: false }, COOKIE_TYPE.LONG);
  });

  test('setConsentSetting converts value to boolean', () => {
    setConsentSetting('marketing', 1, COOKIE_TYPE.LONG);
    expect(spy).toHaveBeenCalledWith({ marketing: true }, COOKIE_TYPE.LONG);
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
    cookieconsent.__Rewire__(
      'getPolicyUrl',
      () => 'http://localhost/path1/path2/path3/'
    );
    expect(shouldShowBanner()).toBe(false);
    cookieconsent.__ResetDependency__('getPolicyUrl');
  });
});

describe('onload', () => {
  const acceptConsent = cookieconsent.__get__('acceptConsent');
  const acceptAnalyticsConsent = cookieconsent.__get__(
    'acceptAnalyticsConsent'
  );
  const hitLoggingUrl = cookieconsent.__get__('hitLoggingUrl');
  const defaultConsent = cookieconsent.__get__('defaultConsent');

  beforeEach(() => {
    cookieconsent.__Rewire__('insertCookieBanner', () => null);
  });
  afterEach(() => {
    cookieconsent.__ResetDependency__('insertCookieBanner');
  });

  test('does not show the banner if shouldShowBanner is false', () => {
    cookieconsent.__Rewire__('shouldShowBanner', () => false);
    const spy = jest.fn();
    cookieconsent.__Rewire__('insertCookieBanner', spy);
    onload();
    expect(spy).not.toHaveBeenCalled();
    cookieconsent.__ResetDependency__('shouldShowBanner');
  });

  test('shows the banner with an acceptConsent, acceptAnalyticsConsent and hitLoggingUrl callbacks', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('insertCookieBanner', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(
      acceptConsent,
      acceptAnalyticsConsent,
      hitLoggingUrl
    );
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
    cookieconsent.__ResetDependency__('isValidVersion');
    cookieconsent.__ResetDependency__('deleteCookies');
  });

  test('does not remove cookies if no current cookie version is found', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('deleteCookies', spy);
    cookieconsent.__Rewire__('isValidVersion', () => null);
    onload();
    expect(spy).not.toHaveBeenCalled();
    cookieconsent.__ResetDependency__('isValidVersion');
    cookieconsent.__ResetDependency__('deleteCookies');
  });
});

describe('acceptConsent', () => {
  const acceptConsent = cookieconsent.__get__('acceptConsent');
  const defaultConsent = cookieconsent.__get__('defaultConsent');

  beforeEach(() => {
    cookieconsent.__Rewire__('setConsent', () => null);
    cookieconsent.__Rewire__('getCookie', () => ({
      defaultConsent,
      version: COOKIE_VERSION,
    }));
  });
  afterEach(() => {
    cookieconsent.__ResetDependency__('getCookie');
    cookieconsent.__ResetDependency__('setConsent');
  });
  test('acceptConsent changes the value of the cookie when consent is given', () => {
    const spy = jest.fn();
    cookieconsent.__Rewire__('setConsent', spy);
    acceptConsent();
    expect(spy).toHaveBeenCalledWith({
      consented: true,
      marketing: defaultConsent.marketing,
      necessary: defaultConsent.necessary,
      preferences: defaultConsent.preferences,
      statistics: defaultConsent.statistics,
    });
  });
});
describe('acceptAnalyticsConsent', () => {
  const acceptAnalyticsConsent = cookieconsent.__get__(
    'acceptAnalyticsConsent'
  );

  let setConsentSpy,
    enableScriptsAndIframesSpy,
    registerSharedConsentLinkHandlerSpy;

  beforeEach(() => {
    setConsentSpy = jest.fn();
    enableScriptsAndIframesSpy = jest.fn();
    registerSharedConsentLinkHandlerSpy = jest.fn();

    cookieconsent.__Rewire__('setConsent', setConsentSpy);
    cookieconsent.__Rewire__(
      'enableScriptsAndIframes',
      enableScriptsAndIframesSpy
    );
    cookieconsent.__Rewire__(
      'registerSharedConsentLinkHandler',
      registerSharedConsentLinkHandlerSpy
    );
  });

  afterEach(() => {
    cookieconsent.__ResetDependency__('setConsent');
    cookieconsent.__ResetDependency__('enableScriptsAndIframes');
    cookieconsent.__ResetDependency__('registerSharedConsentLinkHandler');
  });

  test('calls setConsent with correct arguments', () => {
    acceptAnalyticsConsent();
    expect(setConsentSpy).toHaveBeenCalledWith({
      statistics: true,
      consented: true,
    });
  });

  test('calls enableScriptsAndIframes', () => {
    acceptAnalyticsConsent();
    expect(enableScriptsAndIframesSpy).toHaveBeenCalled();
  });

  test('calls registerSharedConsentLinkHandler', () => {
    acceptAnalyticsConsent();
    expect(registerSharedConsentLinkHandlerSpy).toHaveBeenCalled();
  });
});

describe('hitLoggingUrl', () => {
  const hitLoggingUrl = cookieconsent.__get__('hitLoggingUrl');
  let originalEnv;
  let mockOpen;
  let mockSend;

  beforeEach(() => {
    originalEnv = { ...process.env };
    mockOpen = jest.fn();
    mockSend = jest.fn();
    global.XMLHttpRequest = jest.fn(() => ({
      open: mockOpen,
      send: mockSend,
    }));
  });

  afterEach(() => {
    process.env = originalEnv;
    global.XMLHttpRequest = undefined;
  });
  test('should send a GET request to the correct URL when LOG_TO_SPLUNK is true', () => {
    process.env.LOG_TO_SPLUNK = 'true';
    const route = 'test-route';
    hitLoggingUrl(route);
    expect(mockOpen).toHaveBeenCalledWith(
      'GET',
      `https://www.nhs.uk/our-policies/cookies-policy/?policy-action=${route}`
    );
    expect(mockSend).toHaveBeenCalled();
  });

  test('should not send a request when LOG_TO_SPLUNK is false', () => {
    process.env.LOG_TO_SPLUNK = 'false';
    const route = 'test-route';
    hitLoggingUrl(route);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });
});

describe('shouldShowBanner', () => {
  beforeEach(() => {
    cookieconsent.__Rewire__('getNoBanner', () => true);
  });
  afterEach(() => {
    cookieconsent.__ResetDependency__('getNoBanner');
  });

  test('If nobanner setting is used, never show the banner', () => {
    const shouldShowBanner = cookieconsent.__get__('shouldShowBanner');
    expect(shouldShowBanner()).toBe(false);
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
    expect(spy).toHaveBeenCalledWith(
      {
        consented: false,
        marketing: true,
        necessary: true,
        preferences: true,
        statistics: true,
      },
      'long'
    );
    cookieconsent.__ResetDependency__('setConsent');
  });
});

describe('link href broadcast shared consent querystring parameter', () => {
  const internalUrl = 'https://www.nhs.uk/page';
  const externalUrl = 'https://www.mock-page.uk/';

  afterEach(() => {
    cookieconsent.__ResetDependency__('getConsent');
    const handler = cookieconsent.__get__('handleSharedConsentLinkClick');
    document.removeEventListener('click', handler);
  });

  describe('internal links', () => {
    beforeEach(() => {
      document.body.innerHTML = `<a id="mockLink" href="${internalUrl}">Link</a>`;
    });

    it.each`
      description                                                     | consent                                    | expectedHref
      ${'includes nhsa.sc=1 when analytics is true'}                  | ${{ consented: true, statistics: true }}   | ${`${internalUrl}?nhsa.sc=1`}
      ${'includes nhsa.sc=0 when analytics is false'}                 | ${{ consented: true, statistics: false }}  | ${`${internalUrl}?nhsa.sc=0`}
      ${'omits nhsa.sc when consent is false and analytics is true'}  | ${{ consented: false, statistics: true }}  | ${internalUrl}
      ${'omits nhsa.sc when consent is false and analytics is false'} | ${{ consented: false, statistics: false }} | ${internalUrl}
      ${'omits nhsa.sc when consent is false'}                        | ${{ consented: false }}                    | ${internalUrl}
      ${'omits nhsa.sc when consent is empty'}                        | ${{}}                                      | ${internalUrl}
    `('$description', ({ consent, expectedHref }) => {
      cookieconsent.__Rewire__('getCookie', () => ({
        ...consent,
        version: COOKIE_VERSION,
      }));
      onload();
      const link = document.getElementById('mockLink');
      link.click();
      expect(link.href).toBe(expectedHref);
    });
  });

  describe('external links', () => {
    beforeEach(() => {
      document.body.innerHTML = `<a id="mockLink" href="${externalUrl}">Link</a>`;
    });

    it.each`
      description                                                     | consent                                    | expectedHref
      ${'does not include nhsa.sc=1 when analytics is true'}          | ${{ consented: true, statistics: true }}   | ${externalUrl}
      ${'does not include nhsa.sc=0 when analytics is false'}         | ${{ consented: true, statistics: false }}  | ${externalUrl}
      ${'omits nhsa.sc when consent is false and analytics is true'}  | ${{ consented: false, statistics: true }}  | ${externalUrl}
      ${'omits nhsa.sc when consent is false and analytics is false'} | ${{ consented: false, statistics: false }} | ${externalUrl}
      ${'omits nhsa.sc when consent is false'}                        | ${{ consented: false }}                    | ${externalUrl}
      ${'omits nhsa.sc when consent is empty'}                        | ${{}}                                      | ${externalUrl}
    `('$description', ({ consent, expectedHref }) => {
      cookieconsent.__Rewire__('getCookie', () => ({
        ...consent,
        version: COOKIE_VERSION,
      }));
      onload();
      const link = document.getElementById('mockLink');
      link.click();
      expect(link.href).toBe(expectedHref);
    });
  });
});

describe('consume shared consent', () => {
  const internalUrl = 'https://www.nhs.uk/page';
  let spy;
  let replaceSpy;
  beforeEach(() => {
    delete window.location;
    window.location = { href: '' };
    spy = jest.fn();
    cookieconsent.__Rewire__('setConsent', spy);
    replaceSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    cookieconsent.__ResetDependency__('getCookie');
    cookieconsent.__ResetDependency__('getConsent');
    cookieconsent.__ResetDependency__('setConsent');
  });

  it.each`
    consent                                   | sharedConsent | expectedSetCall
    ${{}}                                     | ${'1'}        | ${[{ ...defaultConsent, consented: true, statistics: true }, COOKIE_TYPE.SESSION]}
    ${{}}                                     | ${'0'}        | ${[{ ...defaultConsent, consented: true, statistics: false }, COOKIE_TYPE.SESSION]}
    ${{ consented: true, statistics: true }}  | ${'0'}        | ${undefined}
    ${{ consented: true, statistics: false }} | ${'0'}        | ${undefined}
    ${{ consented: true, statistics: true }}  | ${'1'}        | ${undefined}
    ${{ consented: true, statistics: false }} | ${'1'}        | ${undefined}
    ${{}}                                     | ${'2'}        | ${undefined}
    ${{ consented: true, statistics: true }}  | ${'2'}        | ${undefined}
    ${{ consented: true, statistics: false }} | ${'2'}        | ${undefined}
  `(
    'sets expected consent when initial consent is $consent and nhsa.sc=$sharedConsent',
    ({ consent, sharedConsent, expectedSetCall }) => {
      const requestUrl = new URL(internalUrl);
      requestUrl.searchParams.set('nhsa.sc', sharedConsent);
      Object.defineProperty(window, 'location', {
        value: new URL(requestUrl),
      });

      cookieconsent.__Rewire__('getCookie', () => ({
        ...consent,
        version: COOKIE_VERSION,
      }));

      onload();

      if (expectedSetCall === undefined) {
        expect(spy).toHaveBeenCalledTimes(0);
      } else {
        expect(spy).toHaveBeenCalledWith(...expectedSetCall);
      }
      // assert that the nhsa.sc query parameter is removed from the URL
      expect(replaceSpy).toHaveBeenCalledTimes(1);

      const [[, , replacedUrl]] = replaceSpy.mock.calls;
      const parsedUrl = new URL(replacedUrl, internalUrl);

      expect(parsedUrl.searchParams.has('nhsa.sc')).toBe(false);
    }
  );
});
