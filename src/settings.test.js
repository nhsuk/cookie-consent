/* global expect, jest, afterEach */
/* eslint-disable no-underscore-dangle */

import settings, { getNoBanner, getPolicyUrl } from './settings';

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
    expect(getPolicyUrl()).toEqual('/our-policies/cookies-policy');
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

