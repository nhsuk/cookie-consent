/* global page, expect, beforeEach */

const { clearAllCookies } = require('./util');

const getCookieNames = async () => {
  const cookies = await page.cookies();
  return cookies.map(cookie => cookie.name);
};

/**
 * Set a fully-consented cookie preference using a specific cookie version number.
 * @param {int} version The version number to use.
 */
const setFullConsentWithVersion = async (version) => {
  /* eslint-disable sort-keys */
  const cookieValue = {
    necessary: true,
    preferences: true,
    statistics: true,
    marketing: true,
    consented: true,
    version,
  };
  /* eslint-enable */
  const cookieValueString = encodeURIComponent(JSON.stringify(cookieValue));
  await page.setCookie({
    name: 'nhsuk-cookie-consent',
    path: '/',
    value: cookieValueString,
  });
};

const setTestCookie = async () => {
  await page.setCookie({
    name: 'testcookie',
    path: '/',
    value: 'test',
  });
};

describe('User has out-of-date consent', () => {
  beforeEach(async () => {
    await clearAllCookies();
    await setTestCookie();
    await setFullConsentWithVersion(0);
    await page.goto('http://localhost:8080/tests/example/');
  });

  it('shows the banner', async () => {
    const banner = await page.evaluate(async () => document.querySelector('.nhsuk-cookie-banner'));
    expect(banner).not.toBe(null);
  });

  it('doesn\'t respect previous cookie settings', async () => {
    const statistics = await page.evaluate(async () => window.NHSCookieConsent.getStatistics());
    expect(statistics).toBe(false);
  });

  it('non-essential cookies are cleared', async () => {
    const cookieNames = await getCookieNames();
    expect(cookieNames).not.toContainEqual('testcookie');
  });
});

describe('User has in-date consent', () => {
  beforeEach(async () => {
    await clearAllCookies();
    await setTestCookie();
    await setFullConsentWithVersion(9999);
    await page.goto('http://localhost:8080/tests/example/');
  });

  it('doesn\'t show the banner', async () => {
    const banner = await page.evaluate(async () => document.querySelector('.nhsuk-cookie-banner'));
    expect(banner).toBe(null);
  });

  it('respects previous cookie settings', async () => {
    const statistics = await page.evaluate(async () => window.NHSCookieConsent.getStatistics());
    expect(statistics).toBe(true);
  });

  it('non-essential cookies are kept', async () => {
    const cookieNames = await getCookieNames();
    expect(cookieNames).toContainEqual('testcookie');
  });
});
