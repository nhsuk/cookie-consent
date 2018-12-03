import { createCookie, getCookie } from './cookies'

test('getCookie function exists', () => {
  expect(getCookie).toBeInstanceOf(Function)
})

test('createCookie function exists', () => {
  expect(createCookie).toBeInstanceOf(Function)
})
