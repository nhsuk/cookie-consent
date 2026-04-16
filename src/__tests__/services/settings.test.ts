/* global expect, afterEach */

const settings = require('../../services/settings').default;
import { COOKIE_SETTINGS_URL, getNoBanner } from '../../services/settings';

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
    scriptTag.dataset.nobanner = 'true';
    settings.__Rewire__('scriptTag', scriptTag);
    expect(getNoBanner()).toBeTruthy();
  });

  test('getNoBanner for <script data-nobanner></script>', () => {
    const scriptTag = document.createElement('script');
    scriptTag.dataset.nobanner = '';
    settings.__Rewire__('scriptTag', scriptTag);
    expect(getNoBanner()).toBeTruthy();
  });
});
