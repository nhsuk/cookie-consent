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
 * Get all cookies from document.cookie and parse them.
 * Returns an object of key/value pairs
 */
function getAllCookies() {
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

  return cookies || {};
}

/*
 * Get a cookie value by name
 */
export function getCookie(name) {
  const cookies = getAllCookies();
  return cookies[name] || null;
}

/*
 * Remove all cookies other than nhsuk-cookie-consent cookie
 */
export function deleteCookies() {
  const cookies = getAllCookies();
  const cookieNames = Object.keys(cookies);
  // We want to delete all cookies except for our consent cookie
  const cookieNamesToDelete = cookieNames.filter(name => name !== 'nhsuk-cookie-consent');

  // generate a list of domains that the cookie could possibly belong to
  const domainParts = window.location.hostname.split('.');
  const domains = domainParts.map((domainPart, i) => { // eslint-disable-line arrow-body-style
    return domainParts.slice(i).join('.');
  });

  // generate a list of paths that the cookie could possibly belong to
  const pathParts = window.location.pathname.split('/');
  const paths = pathParts.map((pathPart, i) => { // eslint-disable-line arrow-body-style
    return pathParts.slice(0, i).join('/');
  }).filter(path => !!path);

  // Loop over every combination of path and domain for each cookie we want to delete
  cookieNamesToDelete.forEach((cookieName) => {
    paths.forEach((path) => {
      domains.forEach((domain) => {
        createCookie(cookieName, '', -1, path, domain);
      });
    });
  });
}
