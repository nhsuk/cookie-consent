/* global expect, jest, afterEach */

import settings, {
  getNoBanner,
  getPolicyUrl,
  makeUrlAbsolute,
  shouldSkipLinkProcessing,
} from './settings';

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

describe('testing getPolicyUrl with environment variables and custom tags', () => {
  // need to set up a temporary environment variable
  const OLD_ENV = process.env;

  afterEach(() => {
    settings.__ResetDependency__('scriptTag');
  });

  test('getPolicyUrl returns environment variable when one is set', () => {
    // Resets the module registry - the cache of all required modules.
    // This is useful to isolate modules where local state might conflict between tests.
    const scriptTag = document.createElement('script');
    settings.__Rewire__('scriptTag', scriptTag);
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.POLICY_URL = 'http://www.example.com/';
    expect(getPolicyUrl()).toEqual('http://www.example.com/');
    process.env = OLD_ENV;
  });

  test('getPolicyUrl returns custom tag when one is set', () => {
    const scriptTag = document.createElement('script');
    settings.__Rewire__('scriptTag', scriptTag);
    scriptTag.setAttribute('data-policy-url', 'data-test');
    expect(getPolicyUrl()).toEqual('data-test');
  });

  test('getPolicyUrl returns default value when no env var or custom tag', () => {
    const scriptTag = document.createElement('script');
    settings.__Rewire__('scriptTag', scriptTag);
    expect(getPolicyUrl()).toEqual('/our-policies/cookies-policy/');
    settings.__ResetDependency__('dataPolicyScript');
  });

  test('getPolicyUrl returns custom tag when both tag and env var are set', () => {
    const scriptTag = document.createElement('script');
    settings.__Rewire__('scriptTag', scriptTag);
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.POLICY_URL = 'http://www.example.com/';
    scriptTag.setAttribute('data-policy-url', 'data-test');
    settings.__Rewire__('scriptTag', scriptTag);
    expect(getPolicyUrl()).toEqual('data-test');
    process.env = OLD_ENV;
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
      'http://localhost/path1/path2/path3/path/to/page.html'
    );
  });

  test('when URL is relative to the domain', () => {
    const url = '/path/to/page.html';
    expect(makeUrlAbsolute(url)).toBe('http://localhost/path/to/page.html');
  });

  test('when the URL has params', () => {
    const url = '/path/to/page.html?q=foo';
    expect(makeUrlAbsolute(url)).toBe(
      'http://localhost/path/to/page.html?q=foo'
    );
  });

  test('when the URL has a hash fragment', () => {
    const url = '/path/to/page.html#section-2';
    expect(makeUrlAbsolute(url)).toBe(
      'http://localhost/path/to/page.html#section-2'
    );
  });
});

describe('shouldSkipLinkProcessing', () => {
  describe('when current URL is differnt to target URL', () => {
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
      description                                              | href                                                 | shouldSkip
      ${'null link should skip'}                               | ${null}                                              | ${true}
      ${'undefined link should skip'}                          | ${undefined}                                         | ${true}
      ${'empty link should skip'}                              | ${''}                                                | ${true}
      ${'internal link should process'}                        | ${'https://nhs.uk/home'}                             | ${false}
      ${'params link should process'}                          | ${'https://nhs.uk?referer=test?val=1'}               | ${false}
      ${'fragment link should process'}                        | ${'https://nhs.uk#field1=error1'}                    | ${false}
      ${'subdomain link should process'}                       | ${'https://assets.nhs.uk'}                           | ${false}
      ${'external link should skip'}                           | ${'https://external.uk'}                             | ${true}
      ${'external with params link should skip'}               | ${'https://external.uk?referer=test?val=1'}          | ${true}
      ${'external fragmanet link should skip'}                 | ${'https://external.uk#field1'}                      | ${true}
      ${'external with params and fragmanet link should skip'} | ${'https://external.uk#field1=error1&field2=error2'} | ${true}
      ${'policy link should skip'}                             | ${'https://nhs.uk/our-policies/cookies-policy/'}     | ${true}
    `('$description', ({ href, shouldSkip }) => {
      let link = null;
      if (href !== null && href !== undefined) {
        link = document.createElement('a');
        link.href = href;
      }

      const result = shouldSkipLinkProcessing(link);
      expect(result).toBe(shouldSkip);
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
    description                                  | href                                                | shouldSkip
    ${'null link should skip'}                   | ${null}                                             | ${true}
    ${'undefined link should skip'}              | ${undefined}                                        | ${true}
    ${'empty link should skip'}                  | ${''}                                               | ${true}
    ${'link should skip'}                        | ${'https://nhs.uk/'}                                | ${true}
    ${'fragment link should skip'}               | ${'https://nhs.uk#fragment'}                        | ${true}
    ${'fragment and params link should skip'}    | ${'https://nhs.uk#field1=error1&field2=error2'}     | ${true}
    ${'params link should process'}              | ${'https://nhs.uk/?referer=test'}                   | ${false}
    ${'fragment link should process'}            | ${'https://nhs.uk/app#fragment'}                    | ${false}
    ${'fragment and params link should process'} | ${'https://nhs.uk/app#field1=error1&field2=error2'} | ${false}
    ${'subdomain link should process'}           | ${'https://assets.nhs.uk'}                          | ${false}
    ${'policy link should skip'}                 | ${'https://nhs.uk/our-policies/cookies-policy/'}    | ${true}
  `('$description', ({ href, shouldSkip }) => {
    let link = null;
    if (href !== null && href !== undefined) {
      link = document.createElement('a');
      link.href = href;
    }

    const result = shouldSkipLinkProcessing(link);
    expect(result).toBe(shouldSkip);
  });
});
