/* global expect, jest, beforeEach, afterEach */

const orchestrator = require('../../services/consentOrchestrator').default;
const consent = require('../../services/consent').default;
import { onload } from '../../services/consentOrchestrator';
import { unregisterSharedConsentLinkHandler } from '../../services/consentBroadcast';
import { COOKIE_VERSION, COOKIE_TYPE } from '../../services/consent';

const defaultConsent = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  consented: false,
};

jest.mock('../../ui/banner', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('onload', () => {
  const acceptConsent = orchestrator.__get__('acceptConsent');
  const acceptAnalyticsConsent = orchestrator.__get__('acceptAnalyticsConsent');
  const hitLoggingUrl = orchestrator.__get__('hitLoggingUrl');
  const defaultConsent = orchestrator.__get__('defaultConsent');

  beforeEach(() => {
    orchestrator.__Rewire__('insertCookieBanner', () => null);
  });
  afterEach(() => {
    orchestrator.__ResetDependency__('insertCookieBanner');
  });

  test('does not show the banner if shouldShowBanner is false', () => {
    orchestrator.__Rewire__('shouldShowBanner', () => false);
    const spy = jest.fn();
    orchestrator.__Rewire__('insertCookieBanner', spy);
    onload();
    expect(spy).not.toHaveBeenCalled();
    orchestrator.__ResetDependency__('shouldShowBanner');
  });

  test('shows the banner with an acceptConsent, acceptAnalyticsConsent and hitLoggingUrl callbacks', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('insertCookieBanner', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(
      acceptConsent,
      acceptAnalyticsConsent,
      hitLoggingUrl,
    );
    orchestrator.__ResetDependency__('insertCookieBanner');
  });

  test('creates a default cookie if needed', () => {
    const spy = jest.fn();
    consent.__Rewire__('getCookie', () => null);
    orchestrator.__Rewire__('setConsent', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(defaultConsent, COOKIE_TYPE.SESSION);
    consent.__ResetDependency__('getCookie');
    orchestrator.__ResetDependency__('setConsent');
  });

  test('enables the appropriate scripts', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('enableScriptsByCategories', spy);
    onload();
    expect(spy).toHaveBeenCalledWith([]);
    orchestrator.__ResetDependency__('enableScriptsByCategories');
  });

  test('enables the appropriate iframes', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('enableIframesByCategories', spy);
    onload();
    expect(spy).toHaveBeenCalledWith([]);
    orchestrator.__ResetDependency__('enableIframesByCategories');
  });
  test('removes cookies if consent version is out-of-date', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('deleteCookies', spy);
    orchestrator.__Rewire__('isValidVersion', () => false);
    onload();
    expect(spy).toHaveBeenCalled();
    orchestrator.__ResetDependency__('isValidVersion');
    orchestrator.__ResetDependency__('deleteCookies');
  });

  test('does not remove cookies if no current cookie version is found', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('deleteCookies', spy);
    orchestrator.__Rewire__('isValidVersion', () => null);
    onload();
    expect(spy).not.toHaveBeenCalled();
    orchestrator.__ResetDependency__('isValidVersion');
    orchestrator.__ResetDependency__('deleteCookies');
  });

  test('removes cookies if schema hash is stale', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('deleteCookies', spy);
    orchestrator.__Rewire__('isValidVersion', () => true);
    orchestrator.__Rewire__('isSchemaValid', () => false);
    onload();
    expect(spy).toHaveBeenCalled();
    orchestrator.__ResetDependency__('isValidVersion');
    orchestrator.__ResetDependency__('isSchemaValid');
    orchestrator.__ResetDependency__('deleteCookies');
  });

  test('creates default session cookie if schema hash is stale', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('isValidVersion', () => true);
    orchestrator.__Rewire__('isSchemaValid', () => false);
    orchestrator.__Rewire__('setConsent', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(defaultConsent, COOKIE_TYPE.SESSION);
    orchestrator.__ResetDependency__('isValidVersion');
    orchestrator.__ResetDependency__('isSchemaValid');
    orchestrator.__ResetDependency__('setConsent');
  });
});

describe('acceptConsent', () => {
  const acceptConsent = orchestrator.__get__('acceptConsent');

  beforeEach(() => {
    orchestrator.__Rewire__('setConsent', () => null);
    consent.__Rewire__('getCookie', () => ({
      defaultConsent,
      version: COOKIE_VERSION,
    }));
  });
  afterEach(() => {
    consent.__ResetDependency__('getCookie');
    orchestrator.__ResetDependency__('setConsent');
  });
  test('acceptConsent changes the value of the cookie when consent is given', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('setConsent', spy);
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
  const acceptAnalyticsConsent = orchestrator.__get__('acceptAnalyticsConsent');

  let setConsentSpy: jest.Mock,
    enableScriptsAndIframesSpy: jest.Mock,
    registerSharedConsentLinkHandlerSpy: jest.Mock;

  beforeEach(() => {
    setConsentSpy = jest.fn();
    enableScriptsAndIframesSpy = jest.fn();
    registerSharedConsentLinkHandlerSpy = jest.fn();

    orchestrator.__Rewire__('setConsent', setConsentSpy);
    orchestrator.__Rewire__(
      'enableScriptsAndIframes',
      enableScriptsAndIframesSpy,
    );
    orchestrator.__Rewire__(
      'registerSharedConsentLinkHandler',
      registerSharedConsentLinkHandlerSpy,
    );
  });

  afterEach(() => {
    orchestrator.__ResetDependency__('setConsent');
    orchestrator.__ResetDependency__('enableScriptsAndIframes');
    orchestrator.__ResetDependency__('registerSharedConsentLinkHandler');
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

describe('NO_BANNER mode', () => {
  beforeEach(() => {
    orchestrator.__Rewire__('getNoBanner', () => true);
  });

  afterEach(() => {
    orchestrator.__ResetDependency__('getNoBanner');
  });

  test('does not show the banner', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('insertCookieBanner', spy);
    onload();
    expect(spy).not.toHaveBeenCalled();
    orchestrator.__ResetDependency__('insertCookieBanner');
  });

  test('sets an implicit consent to all cookie types', () => {
    const spy = jest.fn();
    orchestrator.__Rewire__('setConsent', spy);
    onload();
    expect(spy).toHaveBeenCalledWith(
      {
        consented: false,
        marketing: true,
        necessary: true,
        preferences: true,
        statistics: true,
      },
      'long',
    );
    orchestrator.__ResetDependency__('setConsent');
  });
});

describe('link href broadcast shared consent querystring parameter', () => {
  const sameDomainUrl = 'https://www.nhs.uk/page';
  const authorizedDomainUrl = 'https://www.nhsapp.service.nhs.uk/login';
  const nonAuthorizedDomainUrl =
    'https://www.bhrhospitals.nhs.uk/sexual-health';

  afterEach(() => {
    consent.__ResetDependency__('getCookie');
    unregisterSharedConsentLinkHandler();
  });

  describe('same domain links should not broadcast', () => {
    beforeEach(() => {
      const originalLocation = globalThis.location;
      jest.spyOn(globalThis, 'location', 'get').mockImplementation(() => ({
        ...originalLocation,
        href: 'https://www.nhs.uk/',
      }));
      document.body.innerHTML = `<a id="mockLink" href="${sameDomainUrl}">Link</a>`;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each`
      description                                                                | consentData                                | expectedHref
      ${'does not include nhsa.sc when analytics is true'}                       | ${{ consented: true, statistics: true }}   | ${sameDomainUrl}
      ${'does not include nhsa.sc when analytics is false'}                      | ${{ consented: true, statistics: false }}  | ${sameDomainUrl}
      ${'does not include nhsa.sc when consent is false and analytics is true'}  | ${{ consented: false, statistics: true }}  | ${sameDomainUrl}
      ${'does not include nhsa.sc when consent is false and analytics is false'} | ${{ consented: false, statistics: false }} | ${sameDomainUrl}
      ${'does not include nhsa.sc when consent is false'}                        | ${{ consented: false }}                    | ${sameDomainUrl}
      ${'does not include nhsa.sc when consent is empty'}                        | ${{}}                                      | ${sameDomainUrl}
    `('$description', ({ consentData, expectedHref }) => {
      consent.__Rewire__('getCookie', () => ({
        ...consentData,
        version: COOKIE_VERSION,
      }));
      onload();
      const link = document.getElementById('mockLink') as HTMLAnchorElement;
      link.click();
      expect(link.href).toBe(expectedHref);
    });
  });

  describe('authorized domain links should broadcast', () => {
    beforeEach(() => {
      const originalLocation = globalThis.location;
      jest.spyOn(globalThis, 'location', 'get').mockImplementation(() => ({
        ...originalLocation,
        href: 'https://www.nhs.uk/',
      }));
      document.body.innerHTML = `<a id="mockLink" href="${authorizedDomainUrl}">Link</a>`;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each`
      description                                                                | consentData                                | expectedHref
      ${'includes nhsa.sc=1 when analytics is true'}                             | ${{ consented: true, statistics: true }}   | ${`${authorizedDomainUrl}?nhsa.sc=1`}
      ${'includes nhsa.sc=0 when analytics is false'}                            | ${{ consented: true, statistics: false }}  | ${`${authorizedDomainUrl}?nhsa.sc=0`}
      ${'does not include nhsa.sc when consent is false and analytics is true'}  | ${{ consented: false, statistics: true }}  | ${authorizedDomainUrl}
      ${'does not include nhsa.sc when consent is false and analytics is false'} | ${{ consented: false, statistics: false }} | ${authorizedDomainUrl}
      ${'does not include nhsa.sc when consent is false'}                        | ${{ consented: false }}                    | ${authorizedDomainUrl}
      ${'does not include nhsa.sc when consent is empty'}                        | ${{}}                                      | ${authorizedDomainUrl}
    `('$description', ({ consentData, expectedHref }) => {
      consent.__Rewire__('getCookie', () => ({
        ...consentData,
        version: COOKIE_VERSION,
      }));
      onload();
      const link = document.getElementById('mockLink') as HTMLAnchorElement;
      link.click();
      expect(link.href).toBe(expectedHref);
    });
  });

  describe('non-authorized domain links should not broadcast', () => {
    beforeEach(() => {
      const originalLocation = globalThis.location;
      jest.spyOn(globalThis, 'location', 'get').mockImplementation(() => ({
        ...originalLocation,
        href: 'https://www.nhs.uk/',
      }));
      document.body.innerHTML = `<a id="mockLink" href="${nonAuthorizedDomainUrl}">Link</a>`;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each`
      description                                                                | consentData                                | expectedHref
      ${'does not include nhsa.sc when analytics is true'}                       | ${{ consented: true, statistics: true }}   | ${nonAuthorizedDomainUrl}
      ${'does not include nhsa.sc when analytics is false'}                      | ${{ consented: true, statistics: false }}  | ${nonAuthorizedDomainUrl}
      ${'does not include nhsa.sc when consent is false and analytics is true'}  | ${{ consented: false, statistics: true }}  | ${nonAuthorizedDomainUrl}
      ${'does not include nhsa.sc when consent is false and analytics is false'} | ${{ consented: false, statistics: false }} | ${nonAuthorizedDomainUrl}
      ${'does not include nhsa.sc when consent is false'}                        | ${{ consented: false }}                    | ${nonAuthorizedDomainUrl}
      ${'does not include nhsa.sc when consent is empty'}                        | ${{}}                                      | ${nonAuthorizedDomainUrl}
    `('$description', ({ consentData, expectedHref }) => {
      consent.__Rewire__('getCookie', () => ({
        ...consentData,
        version: COOKIE_VERSION,
      }));
      onload();
      const link = document.getElementById('mockLink') as HTMLAnchorElement;
      link.click();
      expect(link.href).toBe(expectedHref);
    });
  });
});

describe('consume shared consent', () => {
  const internalUrl = 'https://www.nhs.uk/page';
  let spy: jest.Mock;
  let replaceSpy: jest.SpyInstance;
  beforeEach(() => {
    Object.defineProperty(globalThis, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true,
    });
    spy = jest.fn();
    orchestrator.__Rewire__('setConsent', spy);
    replaceSpy = jest
      .spyOn(globalThis.history, 'replaceState')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    orchestrator.__ResetDependency__('setConsent');
    consent.__ResetDependency__('getCookie');
  });

  it.each`
    consentData                               | sharedConsent | expectedSetCall
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
    'sets expected consent when initial consent is $consentData and nhsa.sc=$sharedConsent',
    ({ consentData, sharedConsent, expectedSetCall }) => {
      const requestUrl = new URL(internalUrl);
      requestUrl.searchParams.set('nhsa.sc', sharedConsent);
      Object.defineProperty(globalThis, 'location', {
        value: new URL(requestUrl),
      });

      consent.__Rewire__('getCookie', () => ({
        ...consentData,
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
    },
  );
});
