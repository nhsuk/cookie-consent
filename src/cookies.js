/* eslint-disable prefer-template */

// used to create a new cookie for the user which covers different cookie types
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

/*
 * Get a cookie value by name
 */
export function getCookie(name) {
  const cookiesString = document.cookie || '';
  const cookiesArray = cookiesString.split(';')
    .filter(cookie => cookie !== '')
    .map(cookie => cookie.trim());

  // Turn the cookie array into an object of key/value pairs
  const cookies = cookiesArray.reduce((acc, currentValue) => {
    const [key, value] = currentValue.split('=');
    const decodedValue = decodeURIComponent(value); // URI decoding
    acc[key] = decodedValue; // Assign the value to the object
    return acc;
  }, {});

  return cookies[name] || null;
}
