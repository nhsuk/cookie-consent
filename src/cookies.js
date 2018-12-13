/* eslint-disable prefer-template */

// used to create a new cookie for the user which covers different cookie types
export function createCookie(name, value, days, path, domain, secure) {
  // if number of days is given, sets expiry time
  var expires;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = date.toGMTString();
  } else {
    expires = '';
  }

  // appends name to cookie, making it searchable
  let cookieString = `${name}=${escape(value)}`;

  if (expires) { cookieString += ';expires=' + expires; }

  if (path) { cookieString += ';path=' + escape(path); }

  if (domain) { cookieString += ';domain=' + escape(domain); }

  if (secure) { cookieString += ';secure'; }

  cookieString += ';';

  // cookiestring now contains all necessary details and is turned into a cookie
  document.cookie = cookieString;
}

// gets a cookie based on the name
export function getCookie(name) {
  const dc = document.cookie;
  const prefix = `${name}=`;
  let end;
  let begin = dc.indexOf('; ' + prefix);
  if (begin === -1) {
    begin = dc.indexOf(prefix);
    if (begin !== 0) return null;
  } else {
    begin += 2;
    end = document.cookie.indexOf(';', begin);
    if (end === -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  return decodeURIComponent(dc.substring(begin + prefix.length, end));
}
