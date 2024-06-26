/* global page expect */

const { clearAllCookies } = require('./util');

const waitForVisibleBanner = async () => {
  await page.waitForSelector('.nhsuk-cookie-banner', { visible: true });
};

const waitForHiddenBanner = async () => {
  await page.waitForSelector('.nhsuk-cookie-banner', { hidden: true });
};

describe('Banner is usable', () => {
  beforeEach(async () => {
    await clearAllCookies();
    await page.goto('http://localhost:8080/tests/example/');
    await waitForVisibleBanner();
  });

  it('should display on first page load', async () => {
    const cookieText = await page.evaluate(() => {
      const paragraph = document.querySelector('#nhsuk-cookie-banner .nhsuk-width-container p');
      return paragraph.innerText;
    });
    await expect(cookieText).toMatch("We've put some small files called cookies on your device");
  });

  it('clicking the "Do not use analytics cookies" button should hide banner', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept');
    await waitForHiddenBanner();
  });

  it('clicking the "I\'m OK with analytics cookies" button should hide banner', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept_analytics');
    await waitForHiddenBanner();
  });

  it('clicking the "Do not use analytics cookies" button should show confirmation banner', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept');
    await waitForHiddenBanner();
    await page.waitForSelector('#nhsuk-cookie-confirmation-banner', { visible: true });
  });

  it('clicking the "I\'m OK with analytics cookies" button should show confirmation banner', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept_analytics');
    await waitForHiddenBanner();
    await page.waitForSelector('#nhsuk-cookie-confirmation-banner', { visible: true });
  });

  it('clicking "Do not use analytics cookies" should keep user on the same page', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept');
    expect(page.url()).toEqual('http://localhost:8080/tests/example/');
  });

  it('clicking "I\'m OK with analytics cookies" should keep user on the same page', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept_analytics');
    expect(page.url()).toEqual('http://localhost:8080/tests/example/');
  });

  it('clicking "read more about our cookies" should take the user to another page', async () => {
    const hrefText = await page.evaluate(() => {
      const linkElement = document.getElementById('nhsuk-cookie-banner__link');
      return linkElement.getAttribute('href');
    });
    expect(`http://localhost:8080${hrefText}`).toEqual('http://localhost:8080/our-policies/cookies-policy/');
  });
});

describe('Remember cookie state', () => {
  beforeEach(async () => {
    await clearAllCookies();
    await page.goto('http://localhost:8080/tests/example/');
    await waitForVisibleBanner();
  });

  it('clicking "Do not use analytics cookies" should prevent banner if revisited', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept');
    await waitForHiddenBanner();
    await page.goto('http://localhost:8080/tests/example/');
    const banner = await page.evaluate(async () => document.querySelector('.nhsuk-cookie-banner'));
    expect(banner).toBe(null);
  });

  it('clicking "I\'m OK with analytics cookies" accept button should prevent banner if revisited', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept_analytics');
    await waitForHiddenBanner();
    await page.goto('http://localhost:8080/tests/example/');
    const banner = await page.evaluate(async () => document.querySelector('.nhsuk-cookie-banner'));
    expect(banner).toBe(null);
  });
});

describe('nobanner mode', () => {
  beforeEach(async () => {
    await clearAllCookies();
    await page.goto('http://localhost:8080/tests/example/no-banner.html');
  });

  it('prevents banner from showing', async () => {
    // give the banner a chance to show up
    const banner = await page.evaluate(async () => document.querySelector('.nhsuk-cookie-banner'));
    expect(banner).toBe(null);
  });
});

describe('custom banner url link', () => {
  it('links to custom url', async () => {
    await clearAllCookies();
    await page.goto('http://localhost:8080/tests/example/custom-link.html');
    await waitForVisibleBanner();
    await page.click('#nhsuk-cookie-banner__link');
    expect(page.url()).toEqual('http://localhost:8080/tests/example/cookie-settings.html');
  });

  it('should not display the banner', async () => {
    await clearAllCookies();
    await page.goto('http://localhost:8080/tests/example/custom-link.html');
    await waitForVisibleBanner();
    await page.click('#nhsuk-cookie-banner__link');
    const banner = await page.evaluate(async () => document.querySelector('.nhsuk-cookie-banner'));
    expect(banner).toBe(null);
  });

  it('should still display the banner on other pages', async () => {
    await clearAllCookies();
    await page.goto('http://localhost:8080/tests/example/custom-link.html');
    await waitForVisibleBanner();
    await page.click('#nhsuk-cookie-banner__link');
    // Go back after clicking the policy page link
    await page.goto('http://localhost:8080/tests/example/custom-link.html');
    const banner = await page.evaluate(async () => document.querySelector('.nhsuk-cookie-banner'));
    expect(banner).not.toBe(null);
  });
});
