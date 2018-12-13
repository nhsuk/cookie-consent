import { createCookie, getCookie } from './cookies'

/* https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript */
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

afterEach(() => {
  deleteAllCookies()
})

test('getCookie function exists', () => {
  expect(getCookie).toBeInstanceOf(Function)
})

test('createCookie function exists', () => {
  expect(createCookie).toBeInstanceOf(Function)
})

test('createCookie changes the cookie', () => {
  createCookie("testCookie", "testValue", "");
  createCookie("testCookie", "testValue2", "");
  expect(getCookie("testCookie")).toBe("testValue2")
})

test

test('getCookie gets a cookie', () => {
  document.cookie = "testcookie=testvalue"
  expect(getCookie("testcookie")).toBe("testvalue")
})

test('getCookie returns null for undefined cookie', () => {
  expect(getCookie("notthecookiename")).toBe(null)
})

test('getCookie can handle multiple cookies', () => {
  // set two cookies
  document.cookie = "testcookie=testvalue"
  document.cookie = "anothertestcookie=anothertestvalue"
  expect(getCookie("testcookie")).toBe("testvalue")
  expect(getCookie("anothertestcookie")).toBe("anothertestvalue")
})

test('getCookie can handle cookies with extra data', () => {
  document.cookie = "testcookie=testvalue; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT"
  expect(getCookie("testcookie")).toBe("testvalue")
})

test('getCookie will unescape URL params', () => {
  document.cookie = "testcookie=semi%3Bcolon%3Dequals"
  expect(getCookie("testcookie")).toBe("semi;colon=equals")
})
