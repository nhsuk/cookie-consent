/* global expect, cookieJar */

import {
  createCookie,
  getCookie,
  deleteCookies,
  deleteStaleSessionConsentCookies,
} from '../../services/cookies';
import { analyticsCookieWhitelist } from '../../utils/analyticsCookieMatcher';

/* https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript */
function deleteAllCookies(): void {
  cookieJar.removeAllCookiesSync();
}

describe('getCookie', () => {
  beforeEach(() => {
    deleteAllCookies();
  });

  test('function exists', () => {
    expect(getCookie).toBeInstanceOf(Function);
  });

  test('gets a cookie', () => {
    document.cookie = 'testcookie=testvalue';
    expect(getCookie('testcookie')).toBe('testvalue');
  });

  test('returns null for undefined cookie', () => {
    document.cookie = 'testcookie=testvalue';
    expect(getCookie('notthecookiename')).toBe(null);
  });

  test('handles multiple cookies', () => {
    // set two cookies
    document.cookie = 'testcookie=testvalue';
    document.cookie = 'anothertestcookie=anothertestvalue';
    expect(getCookie('testcookie')).toBe('testvalue');
    expect(getCookie('anothertestcookie')).toBe('anothertestvalue');
  });

  test('getCookie can handle cookies with extra data', () => {
    document.cookie =
      'testcookie=testvalue; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT';
    expect(getCookie('testcookie')).toBe('testvalue');
  });

  test('getCookie will unescape URL params', () => {
    document.cookie = 'testcookie=semi%3Bcolon%3Dequals';
    expect(getCookie('testcookie')).toBe('semi;colon=equals');
  });
});

describe('createCookie', () => {
  beforeEach(() => {
    deleteAllCookies();
  });

  test('function exists', () => {
    expect(createCookie).toBeInstanceOf(Function);
  });

  test('createCookie creates a cookie', () => {
    createCookie('testcookie', 'testvalue', 0);
    expect(document.cookie).toBe('testcookie=testvalue');
  });

  test('createCookie changes an existing cookie', () => {
    document.cookie = 'testcookie=testvalue';
    createCookie('testcookie', 'testvalue2', 0);
    expect(document.cookie).toBe('testcookie=testvalue2');
  });

  test('createCookie includes domain when domain contains a dot', () => {
    const cookieSetterSpy = jest.spyOn(document, 'cookie', 'set');

    createCookie('testcookie', 'testvalue', 0, '/', 'www.nhs.uk');

    expect(cookieSetterSpy).toHaveBeenCalledWith(
      expect.stringContaining(';domain=www.nhs.uk'),
    );
    cookieSetterSpy.mockRestore();
  });

  test('createCookie does not include domain when domain does not contain a dot', () => {
    const cookieSetterSpy = jest.spyOn(document, 'cookie', 'set');

    createCookie('testcookie', 'testvalue', 0, '/', 'localhost');

    expect(cookieSetterSpy).toHaveBeenCalled();
    expect(cookieSetterSpy.mock.calls[0][0]).not.toContain(';domain=');
    cookieSetterSpy.mockRestore();
  });

  test('createCookie includes secure flag when secure is true', () => {
    const cookieSetterSpy = jest.spyOn(document, 'cookie', 'set');

    createCookie('testcookie', 'testvalue', 0, '/', undefined, true);

    expect(cookieSetterSpy).toHaveBeenCalledWith(
      expect.stringContaining(';secure'),
    );
    cookieSetterSpy.mockRestore();
  });
});

describe('deleteCookies', () => {
  beforeEach(() => {
    deleteAllCookies();
  });

  test('function exists', () => {
    expect(deleteCookies).toBeInstanceOf(Function);
  });

  test('deletes all cookies except nhsuk-cookie-consent', () => {
    document.cookie = 'nhsuk-cookie-consent=consentvalue';
    document.cookie = 'testcookie=testvalue';
    document.cookie = 'anothertestcookie=anothertestvalue';
    deleteCookies('nhsuk-cookie-consent');
    expect(document.cookie).toBe('nhsuk-cookie-consent=consentvalue');
  });

  test('deletes cookies, even if they have a path', () => {
    document.cookie = 'testcookie=testvalue; Path=/path1/path2';
    deleteCookies('nhsuk-cookie-consent');
    expect(document.cookie).toBe('');
  });

  test.each(analyticsCookieWhitelist.exact)(
    'removes exact analytics cookie: %s',
    (cookieName) => {
      document.cookie = `${cookieName}=somevalue`;
      deleteStaleSessionConsentCookies();
      expect(document.cookie).not.toContain(`${cookieName}=`);
    },
  );

  test('removes cookies that match exact analytics cookie names', () => {
    document.cookie = '_ga=test';
    document.cookie = '_gid=test';
    document.cookie = 'nhsuk-cookie-consent=consentvalue';

    deleteStaleSessionConsentCookies();

    expect(document.cookie).toContain('nhsuk-cookie-consent=consentvalue');
    expect(document.cookie).not.toContain('_ga=');
    expect(document.cookie).not.toContain('_gid=');
  });

  test('removes analytics cookies matching known patterns', () => {
    document.cookie = 'AMCV_ABC123XYZ=value';
    document.cookie = 'AMCVS_148B51E15AE825F50A495DCC%40AdobeOrg=value';
    document.cookie = 'QSI_SI_(id)_intercept=value';

    deleteStaleSessionConsentCookies();

    expect(document.cookie).not.toMatch(/AMCV_/);
    expect(document.cookie).not.toMatch(/AMCVS_/);
    expect(document.cookie).not.toContain('QSI_SI_');
  });
});
