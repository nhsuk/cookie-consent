/* global expect, jest */
/* eslint-disable no-underscore-dangle */

import enable, { enableScriptsByCategories, enableIframesByCategories } from './enable';

test('enableScript enables a javascript snippet', () => {
  const enableScript = enable.__get__('enableScript');
  document.body.innerHTML = '<script src="./abc.js" data-cookieconsent="abc" type="text/plain"></script>';
  const element = document.querySelector('script');
  enableScript(element);

  const script = document.querySelector('script');
  const type = script.getAttribute('type');
  const src = script.getAttribute('src');
  expect(type).toBe('text/javascript');
  expect(src).toBe('./abc.js');
});

test('enableScriptsByCategory enables inline javascript snippets', () => {
  window.inlineJsEnabled = false;
  document.body.innerHTML = `
    <script data-cookieconsent="abc" type="text/plain">
      window.inlineJsEnabled = true;
    </script>
  `;
  enableScriptsByCategories('abc');

  expect(window.inlineJsEnabled).toBe(true);
});

test('enableIframesByCategory is a function', () => {
  expect(enableScriptsByCategories).toBeInstanceOf(Function);
});

test('enableIframe enables an iframe', () => {
  const enableIframe = enable.__get__('enableIframe');
  document.body.innerHTML = '<iframe data-src="abc.html" data-cookieconsent="abc"></iframe>';
  const element = document.querySelector('iframe');
  enableIframe(element);

  const src = document.querySelector('iframe').getAttribute('src');
  expect(src).toBe('abc.html');
});

test('enableScriptsByCategories is a function', () => {
  expect(enableScriptsByCategories).toBeInstanceOf(Function);
});

describe('enableScriptsByCategories enables javascript snippets', () => {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
    enable.__Rewire__('enableScript', spy);
  });

  afterEach(() => {
    enable.__ResetDependency__('enableScript');
  });

  test('for one matching category', () => {
    document.body.innerHTML = '<script src="./abc.js" data-cookieconsent="abc" type="text/plain"></script>';
    enableScriptsByCategories(['abc']);
    const element = document.querySelector('script');
    expect(spy).toHaveBeenCalledWith(element);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('for one matching category and one mismatch', () => {
    document.body.innerHTML = '<script src="./abc.js" data-cookieconsent="abc" type="text/plain"></script>';
    const element = document.querySelector('script');
    document.body.innerHTML += '<script src="./xyz.js" data-cookieconsent="xyz" type="text/plain"></script>';
    enableScriptsByCategories(['abc']);
    expect(spy).toHaveBeenCalledWith(element);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('for a matching category with two cookie types', () => {
    document.body.innerHTML = '<script src="./abc.js" data-cookieconsent="abc,xyz" type="text/plain"></script>';
    const element = document.querySelector('script');
    enableScriptsByCategories(['abc', 'xyz']);
    expect(spy).toHaveBeenCalledWith(element);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('for two matching categories with two cookie types', () => {
    document.body.innerHTML = '<script src="./abc.js" data-cookieconsent="abc" type="text/plain"></script>';
    document.body.innerHTML += '<script src="./xyz.js" data-cookieconsent="xyz" type="text/plain"></script>';
    enableScriptsByCategories(['abc', 'xyz']);
    expect(spy).toHaveBeenCalledWith(document.querySelectorAll('script')[0]);
    expect(spy).toHaveBeenCalledWith(document.querySelectorAll('script')[1]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('for no matches', () => {
    document.body.innerHTML = '<script src="./no-match.js" data-cookieconsent="no-match" type="text/plain"></script>';
    enableScriptsByCategories(['abc', 'xyz']);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('enableIframesByCategories enables iframes', () => {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
    enable.__Rewire__('enableIframe', spy);
  });

  afterEach(() => {
    enable.__ResetDependency__('enableIframe');
  });

  test('for one matching category', () => {
    document.body.innerHTML = '<iframe data-src="./abc.js" data-cookieconsent="abc"></iframe>';
    enableIframesByCategories(['abc']);
    const element = document.querySelector('iframe');
    expect(spy).toHaveBeenCalledWith(element);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('for one matching category and one mismatch', () => {
    document.body.innerHTML = '<iframe data-src="./abc.js" data-cookieconsent="abc"></iframe>';
    const element = document.querySelector('iframe');
    document.body.innerHTML += '<iframe data-src="./xyz.js" data-cookieconsent="xyz"></iframe>';
    enableIframesByCategories(['abc']);
    expect(spy).toHaveBeenCalledWith(element);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('for a matching category with two cookie types', () => {
    document.body.innerHTML = '<iframe data-src="./abc.js" data-cookieconsent="abc,xyz"></iframe>';
    const element = document.querySelector('iframe');
    enableIframesByCategories(['abc', 'xyz']);
    expect(spy).toHaveBeenCalledWith(element);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('for two matching categories with two cookie types', () => {
    document.body.innerHTML = '<iframe data-src="./abc.js" data-cookieconsent="abc"></iframe>';
    document.body.innerHTML += '<iframe data-src="./xyz.js" data-cookieconsent="xyz"></iframe>';
    enableIframesByCategories(['abc', 'xyz']);
    expect(spy).toHaveBeenCalledWith(document.querySelectorAll('iframe')[0]);
    expect(spy).toHaveBeenCalledWith(document.querySelectorAll('iframe')[1]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('for no matches', () => {
    document.body.innerHTML = '<iframe data-src="./no-match.js" data-cookieconsent="no-match"></iframe>';
    enableIframesByCategories(['abc', 'xyz']);
    expect(spy).not.toHaveBeenCalled();
  });
});
