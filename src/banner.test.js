/* global expect, jest, beforeEach, afterEach */
/* eslint-disable no-underscore-dangle */

import banner, { getPolicyUrl } from './banner';

describe('testing getPolicyUrl with environment variables and custom tags', () => {
  // need to set up a temporary environment variable
  const OLD_ENV = process.env;

  afterEach(() => {
    banner.__ResetDependency__('dataPolicyScript');
  });

  test('getPolicyUrl returns environment variable when one is set', () => {
    // Resets the module registry - the cache of all required modules.
    // This is useful to isolate modules where local state might conflict between tests.
    const dataPolicyScript = document.createElement('script');
    banner.__Rewire__('dataPolicyScript', dataPolicyScript);
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.POLICY_URL = 'http://www.example.com/';
    expect(getPolicyUrl()).toEqual('http://www.example.com/');
    process.env = OLD_ENV;
  });

  test('getPolicyUrl returns custom tag when one is set', () => {
    const dataPolicyScript = document.createElement('script');
    banner.__Rewire__('dataPolicyScript', dataPolicyScript);
    dataPolicyScript.setAttribute('data-policy-url', 'data-test');
    expect(getPolicyUrl()).toEqual('data-test');
  });

  test('getPolicyUrl returns default value when no env var or custom tag', () => {
    const dataPolicyScript = document.createElement('script');
    banner.__Rewire__('dataPolicyScript', dataPolicyScript);
    expect(getPolicyUrl()).toEqual('./our-policies/cookies-policy');
    banner.__ResetDependency__('dataPolicyScript');
  });

  test('getPolicyUrl returns custom tag when both tag and env var are set', () => {
    const dataPolicyScript = document.createElement('script');
    banner.__Rewire__('dataPolicyScript', dataPolicyScript);
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.POLICY_URL = 'http://www.example.com/';
    dataPolicyScript.setAttribute('data-policy-url', 'data-test');
    banner.__Rewire__('dataPolicyScript', dataPolicyScript);
    expect(getPolicyUrl()).toEqual('data-test');
    process.env = OLD_ENV;
  });
});
