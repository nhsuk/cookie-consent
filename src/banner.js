import bannerHtml from './banner.html';
import bannerCss from './style.css';

export function hideCookieBanner() {
  document.getElementById('cookie-banner').style.display = 'none';
}

export function insertCookieBanner() {
  // add a css block to the inserted html
  const html = `${bannerHtml} <style>${bannerCss.toString()}</style>`;
  document.getElementsByTagName('body')[0].innerHTML = html + document.getElementsByTagName('body')[0].innerHTML;
  document.getElementById('cookiebannerclose').onclick = hideCookieBanner;
}

const COOKIE_NAME = 'nhsuk-cookie-consent';

// gets a raw cookie from list of cookies based on name
export function getCookie(name) {
  var getCookieValues = function(cookie) {
    if (document.cookie != "") {
      var cookieArray = cookie.split('=');
      return cookieArray[1].trim();
    }
  };

  var getCookieNames = function(cookie) {
	var cookieArray = cookie.split('=');
    return cookieArray[0].trim();
  };

  var cookies = document.cookie.split(';');
  var cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)];
  return (cookieValue === undefined) ? null : decodeURIComponent(cookieValue);
}

export function createCookie(name, value, days, path, domain, secure) {
  // if number of days is given, sets expiry time
  let expires;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = date.toGMTString();
  } else {
    expires = '';
  }

  // appends name to cookie, making it searchable
  let cookieString = `${name}=${escape(value)}`;

  if (expires) {
    cookieString += ';expires=' + expires;
  }

  if (path) {
    cookieString += ';path=' + escape(path);
  }

  if (domain) {
    cookieString += ';domain=' + escape(domain);
  }

  if (secure) {
    cookieString += ';secure';
  }

  cookieString += ';';

  // cookiestring now contains all necessary details and is turned into a cookie
  document.cookie = cookieString;
}

function checkCookie() {
  // If there isn't a user cookie, create one
  console.log(getCookie(COOKIE_NAME));
  if (getCookie(COOKIE_NAME) == null) {
    createCookie(COOKIE_NAME, COOKIE_NAME, 365, '/');
    insertCookieBanner();
  }
}

window.addEventListener('load', checkCookie);
