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

  // In the cookie spec, domains must have a '.' so e.g `localhost` is not valid
  // and should never be set as the domain.
  if (domain && domain.indexOf('.') !== -1) {
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

/*
 * Remove all cookies other than nhsuk-cookie-consent cookie
 */
export function deleteCookies() {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const domain = window.location.hostname.split('.');
    while (domain.length > 0) {
      const cookieBase = encodeURIComponent(cookies[i].split(';')[0].split('=')[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + domain.join('.') + ' ;path=';
      if (cookieBase.split('=')[0] !== 'nhsuk-cookie-consent') {
        const path = window.location.pathname.split('/');
        // give all cookies same domain so they can be deleted
        document.cookie = cookieBase + '/';
        while (path.length > 0) {
          document.cookie = cookieBase + path.join('/');
          path.pop();
        }
        // remove 0th index
        domain.shift();
      } else {
        break;
      }
    }
  }
}
