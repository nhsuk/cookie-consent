/* global page, expect, beforeAll */

describe('Javascript API', () => {
  const getGlobal = async () => page.evaluate(async () => window.NHSCookieConsent);

  beforeAll(async () => {
    await page.goto('http://localhost:8080/tests/example/');
  });

  it('should expose a global object', async () => {
    const NHSCookieConsent = await getGlobal('NHSCookieConsent');
    expect(typeof NHSCookieConsent).toBe('object');
  });

  it('should show the version', async () => {
    const NHSCookieConsent = await getGlobal('NHSCookieConsent');
    expect(typeof NHSCookieConsent.VERSION).toBe('string');
  });

  it('version should be a semver string', async () => {
    const NHSCookieConsent = await getGlobal('NHSCookieConsent');
    const version = NHSCookieConsent.VERSION;

    // simple regex matching three numbers separated by dots.
    expect(version).toMatch(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);
  });
});
