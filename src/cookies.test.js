/* global expect, cookieJar */

import { createCookie, getCookie, deleteCookies } from './cookies';

/* https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript */
function deleteAllCookies() {
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
    document.cookie = 'testcookie=testvalue; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT';
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
    createCookie('testcookie', 'testvalue', '');
    expect(document.cookie).toBe('testcookie=testvalue');
  });

  test('createCookie changes an existing cookie', () => {
    document.cookie = 'testcookie=testvalue';
    createCookie('testcookie', 'testvalue2', '');
    expect(document.cookie).toBe('testcookie=testvalue2');
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
    deleteCookies();
    expect(document.cookie).toBe('nhsuk-cookie-consent=consentvalue');
  });

  test('deletes cookies, even if they have a path', () => {
    document.cookie = 'testcookie=testvalue; Path=/path1/path2';
    deleteCookies();
    expect(document.cookie).toBe('');
  });
});
