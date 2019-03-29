/* global page, expect, beforeAll */

import { clearAllCookies } from './util';

const getCookieNames = async () => {
  const cookies = await page.cookies();
  return cookies.map(cookie => cookie.name);
};

describe('Cookies set on first load', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/tests/example/');
  });

  it('should load necessary cookies', async () => {
    const cookieNames = await getCookieNames();
    expect(cookieNames).toContainEqual('necessary');
  });

  it('should not load unecessary cookeis', async () => {
    const cookieNames = await getCookieNames();
    expect(cookieNames).not.toContainEqual('unecessary');
  });

  it('one cookie should be the consent preference', async () => {
    const cookieNames = await getCookieNames();
    expect(cookieNames).toContainEqual('nhsuk-cookie-consent');
  });
});

describe('Cookies are set after accepting statistics', () => {
  const waitForVisibleModal = async () => {
    await page.waitForSelector('.nhsuk-cookie-banner', { visible: true });
  };

  const waitForHiddenModal = async () => {
    await page.waitForSelector('.nhsuk-cookie-banner', { hidden: true });
  };

  beforeAll(async () => {
    await clearAllCookies();
    await page.goto('http://localhost:8080/tests/example/');
    await waitForVisibleModal();
    await page.click('#nhsuk-cookie-banner__link_accept');
    await waitForHiddenModal();
  });

  it('should load accepted cookies', async () => {
    const cookieNames = await getCookieNames();
    expect(cookieNames).toContainEqual('necessary');
    expect(cookieNames).toContainEqual('statistics');
  });

  it('should load cookies from inline javascript', async () => {
    const cookieNames = await getCookieNames();
    expect(cookieNames).toContainEqual('inline-js');
  });
});
