/* global expect */

import { enableScriptsByCategory, enableIframesByCategory } from './enable'

test('enableScriptsByCategory is a function', () => {
  expect(enableScriptsByCategory).toBeInstanceOf(Function)
})

test('enableScriptsByCategory enables javascript snippets', () => {
  document.body.innerHTML = '<script src="./abc.js" data-cookieconsent="abc" type="text/plain"></script>'
  enableScriptsByCategory('abc')
  const script = document.querySelector('script')
  const type = script.getAttribute('type')
  const src = script.getAttribute('src')

  expect(type).toBe('text/javascript')
  expect(src).toBe('./abc.js')
})

test('enableIframesByCategory is a function', () => {
  expect(enableScriptsByCategory).toBeInstanceOf(Function)
})

test('enableIframesByCategory enables iframes', () => {
  document.body.innerHTML = '<iframe data-src="abc.html" data-cookieconsent="abc"></iframe>'
  enableIframesByCategory('abc')
  const src = document.querySelector('iframe').getAttribute('src')
  expect(src).toBe('abc.html')
})
