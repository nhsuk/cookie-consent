/* global expect, jest, afterEach */

import settings, {
  COOKIE_SETTINGS_URL,
  getNoBanner,
  makeUrlAbsolute,
  shouldBroadcastConsent,
} from './settings';

describe('cookie settings URL constant', () => {
  test('exports the default cookie settings URL', () => {
    expect(COOKIE_SETTINGS_URL).toBe(
      '/our-policies/choose-your-cookie-settings/',
    );
  });
});

describe('get script settings for no banner', () => {
  afterEach(() => {
    settings.__ResetDependency__('scriptTag');
  });

  test('getNoBanner gets the default settings when scriptTag is not set', () => {
    expect(getNoBanner()).toBeFalsy();
  });

  test('getNoBanner for <script></script>', () => {
    const scriptTag = document.createElement('script');
    settings.__Rewire__('scriptTag', scriptTag);
    expect(getNoBanner()).toBeFalsy();
  });

  test('getNoBanner for <script data-nobanner="true"></script>', () => {
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('data-nobanner', 'true');
    settings.__Rewire__('scriptTag', scriptTag);
    expect(getNoBanner()).toBeTruthy();
  });

  test('getNoBanner for <script data-nobanner></script>', () => {
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('data-nobanner', '');
    settings.__Rewire__('scriptTag', scriptTag);
    expect(getNoBanner()).toBeTruthy();
  });
});

describe('get an absolute URL', () => {
  test('when URL is already absolute', () => {
    const url = 'http://example.com/path/to/page.html';
    expect(makeUrlAbsolute(url)).toBe(url);
  });

  test('when URL is relative', () => {
    const url = './path/to/page.html';
    expect(makeUrlAbsolute(url)).toBe(
      'http://localhost/path1/path2/path3/path/to/page.html',
    );
  });

  test('when URL is relative to the domain', () => {
    const url = '/path/to/page.html';
    expect(makeUrlAbsolute(url)).toBe('http://localhost/path/to/page.html');
  });

  test('when the URL has params', () => {
    const url = '/path/to/page.html?q=foo';
    expect(makeUrlAbsolute(url)).toBe(
      'http://localhost/path/to/page.html?q=foo',
    );
  });

  test('when the URL has a hash fragment', () => {
    const url = '/path/to/page.html#section-2';
    expect(makeUrlAbsolute(url)).toBe(
      'http://localhost/path/to/page.html#section-2',
    );
  });
});

describe('shouldBroadcastConsent', () => {
  describe('when current URL is different to target URL', () => {
    beforeEach(() => {
      const originalLocation = window.location;
      jest.spyOn(window, 'location', 'get').mockImplementation(() => ({
        ...originalLocation,
        href: 'http://nhs.uk/path1/path2/path3/',
      }));
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each`
      description                                                     | href                                                             | shouldBroad
      ${'null link should not broadcast'}                             | ${null}                                                          | ${false}
      ${'undefined link should not broadcast'}                        | ${undefined}                                                     | ${false}
      ${'empty link should not broadcast'}                            | ${''}                                                            | ${false}
      ${'same domain link should not broadcast'}                      | ${'https://nhs.uk/home'}                                         | ${false}
      ${'same domain with params should not broadcast'}               | ${'https://nhs.uk?referer=test?val=1'}                           | ${false}
      ${'same domain with fragment should not broadcast'}             | ${'https://nhs.uk#field1=error1'}                                | ${false}
      ${'same domain subdomain should not broadcast'}                 | ${'https://assets.nhs.uk'}                                       | ${false}
      ${'cookie settings link should not broadcast'}                  | ${'https://nhs.uk/our-policies/choose-your-cookie-settings/'}    | ${false}
      ${'authorized external cookie settings link should broadcast'}  | ${'https://www.nhs.uk/our-policies/choose-your-cookie-settings/'} | ${true}
      ${'non-authorized external link should not broadcast'}          | ${'https://external.uk'}                                         | ${false}
      ${'non-authorized external with params should not broadcast'}   | ${'https://external.uk?referer=test?val=1'}                      | ${false}
      ${'non-authorized external with fragment should not broadcast'} | ${'https://external.uk#field1'}                                  | ${false}
      ${'non-authorized external complex should not broadcast'}       | ${'https://external.uk#field1=error1&field2=error2'}             | ${false}
      ${'authorized domain www.nhs.uk should broadcast'}              | ${'https://www.nhs.uk/services'}                                 | ${true}
      ${'authorized domain organisation.nhswebsite should broadcast'} | ${'https://organisation.nhswebsite.nhs.uk'}                      | ${true}
      ${'authorized domain www.nhsapp.service should broadcast'}      | ${'https://www.nhsapp.service.nhs.uk/login'}                     | ${true}
      ${'authorized domain access.login should broadcast'}            | ${'https://access.login.nhs.uk'}                                 | ${true}
      ${'authorized domain with params should broadcast'}             | ${'https://www.nhs.uk/services?ref=test'}                        | ${true}
      ${'authorized domain with fragment should broadcast'}           | ${'https://www.nhsapp.service.nhs.uk/login#section'}             | ${true}
    `('$description', ({ href, shouldBroad }) => {
      let link = null;
      if (href !== null && href !== undefined) {
        link = document.createElement('a');
        link.href = href;
      }

      const result = shouldBroadcastConsent(link);
      expect(result).toBe(shouldBroad);
    });
  });
});

describe('when current URL is same as target URL', () => {
  beforeEach(() => {
    const originalLocation = window.location;
    jest.spyOn(window, 'location', 'get').mockImplementation(() => ({
      ...originalLocation,
      href: 'http://nhs.uk',
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    description                                          | href                                                             | shouldBroad
    ${'null link should not broadcast'}                  | ${null}                                                          | ${false}
    ${'undefined link should not broadcast'}             | ${undefined}                                                     | ${false}
    ${'empty link should not broadcast'}                 | ${''}                                                            | ${false}
    ${'same domain link should not broadcast'}           | ${'https://nhs.uk/'}                                             | ${false}
    ${'same domain with fragment should not broadcast'}  | ${'https://nhs.uk#fragment'}                                     | ${false}
    ${'same domain with params should not broadcast'}    | ${'https://nhs.uk#field1=error1&field2=error2'}                  | ${false}
    ${'same domain different path should not broadcast'} | ${'https://nhs.uk/?referer=test'}                                | ${false}
    ${'same domain app path should not broadcast'}       | ${'https://nhs.uk/app#fragment'}                                 | ${false}
    ${'same domain complex path should not broadcast'}   | ${'https://nhs.uk/app#field1=error1&field2=error2'}              | ${false}
    ${'same domain subdomain should not broadcast'}      | ${'https://assets.nhs.uk'}                                       | ${false}
    ${'cookie settings link should not broadcast'}       | ${'https://nhs.uk/our-policies/choose-your-cookie-settings/'}    | ${false}
    ${'authorized external cookie settings should broadcast'} | ${'https://www.nhs.uk/our-policies/choose-your-cookie-settings/'} | ${true}
    ${'authorized domain www.nhs.uk should broadcast'}   | ${'https://www.nhs.uk/home'}                                     | ${true}
    ${'authorized domain nhsapp should broadcast'}       | ${'https://www.nhsapp.service.nhs.uk/login'}                     | ${true}
    ${'authorized domain access.login should broadcast'} | ${'https://access.login.nhs.uk'}                                 | ${true}
  `('$description', ({ href, shouldBroad }) => {
    let link = null;
    if (href !== null && href !== undefined) {
      link = document.createElement('a');
      link.href = href;
    }

    const result = shouldBroadcastConsent(link);
    expect(result).toBe(shouldBroad);
  });
});

describe('when current URL is on an authorized domain', () => {
  beforeEach(() => {
    const originalLocation = window.location;
    jest.spyOn(window, 'location', 'get').mockImplementation(() => ({
      ...originalLocation,
      href: 'https://www.nhsapp.service.nhs.uk/login',
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    description                                                    | href                                                             | shouldBroad
    ${'same authorized domain link should not broadcast'}          | ${'https://www.nhsapp.service.nhs.uk/dashboard'}                 | ${false}
    ${'same authorized domain with params should not broadcast'}   | ${'https://www.nhsapp.service.nhs.uk/login?ref=test'}            | ${false}
    ${'same authorized domain with fragment should not broadcast'} | ${'https://www.nhsapp.service.nhs.uk/home#section'}              | ${false}
    ${'different authorized domain www.nhs.uk should broadcast'}   | ${'https://www.nhs.uk/services'}                                 | ${true}
    ${'different authorized domain access.login should broadcast'} | ${'https://access.login.nhs.uk'}                                 | ${true}
    ${'different authorized domain organisation should broadcast'} | ${'https://organisation.nhswebsite.nhs.uk'}                      | ${true}
    ${'different authorized domain with params should broadcast'}  | ${'https://www.nhs.uk/services?ref=x'}                           | ${true}
    ${'non-authorized domain should not broadcast'}                | ${'https://google.com'}                                          | ${false}
    ${'non-authorized subdomain should not broadcast'}             | ${'https://subdomain.example.com'}                               | ${false}
    ${'cookie settings link should not broadcast'}                 | ${'https://nhs.uk/our-policies/choose-your-cookie-settings/'}    | ${false}
  `('$description', ({ href, shouldBroad }) => {
    let link = null;
    if (href !== null && href !== undefined) {
      link = document.createElement('a');
      link.href = href;
    }

    const result = shouldBroadcastConsent(link);
    expect(result).toBe(shouldBroad);
  });
});
