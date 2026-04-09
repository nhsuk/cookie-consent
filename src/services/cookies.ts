import { getMatchingAnalyticsCookies } from '../utils/analyticsCookieMatcher';

// used to create a new cookie for the user which covers different cookie types
export function createCookie(
  name: string,
  value: string,
  days?: number,
  path?: string,
  domain?: string,
  secure?: boolean,
): void {
  // if number of days is given, sets expiry time
  let expires;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = date.toUTCString();
  } else {
    expires = '';
  }

  // appends name to cookie, making it searchable
  let cookieString = `${name}=${encodeURI(value)}`;

  if (expires) {
    cookieString += `;expires=${expires}`;
  }

  if (path) {
    cookieString += `;path=${encodeURI(path)}`;
  }

  // In the cookie spec, domains must have a '.' so e.g `localhost` is not valid
  // and should never be set as the domain.
  if (domain?.includes('.')) {
    cookieString += `;domain=${encodeURI(domain)}`;
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
function getAllCookies(): Record<string, string> {
  const cookiesString = document.cookie || '';
  const cookiesArray = cookiesString
    .split(';')
    .filter((cookie) => cookie !== '')
    .map((cookie) => cookie.trim());

  // Turn the cookie array into an object of key/value pairs
  const cookies = cookiesArray.reduce<Record<string, string>>(
    (acc, currentValue) => {
      const [key, value] = currentValue.split('=');
      const decodedValue = decodeURIComponent(value); // URI decoding
      acc[key] = decodedValue; // Assign the value to the object
      return acc;
    },
    {},
  );

  return cookies;
}

/*
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const cookies = getAllCookies();
  return cookies[name] || null;
}

/*
 * Remove all cookies other than the specified consent cookie
 */
export function deleteCookies(consentCookieName: string): void {
  const cookies = getAllCookies();
  const cookieNames = Object.keys(cookies);
  // We want to delete all cookies except for our consent cookie
  const cookieNamesToDelete = cookieNames.filter(
    (name) => name !== consentCookieName,
  );

  deleteCookieFromAllPathsAndDomains(cookieNamesToDelete);
}

/**
 * Removes analytics and tracking cookies that were set based on session based
 * user consent. This should be called on page
 * load when no persistent consent is present, but a session based consent might
 * have previously caused analytics cookies to be added.
 *
 * This ensures stale analytics cookies (e.g., from Adobe or GA) are cleaned up
 * if the user's session has ended and consent has not been explicitly granted again.
 *
 * @function removeStaleSessionConsentCookies
 * @returns {void}
 */
export function deleteStaleSessionConsentCookies(): void {
  const cookies = getAllCookies();
  const cookieNames = Object.keys(cookies);
  const staleAnalyticsCookies = getMatchingAnalyticsCookies(cookieNames);

  deleteCookieFromAllPathsAndDomains(staleAnalyticsCookies);
}

function deleteCookieFromAllPathsAndDomains(cookieNames: string[]): void {
  if (!Array.isArray(cookieNames) || cookieNames.length === 0) return;

  const domainParts = globalThis.location.hostname.split('.');
  const domains = domainParts.map((domainPart, i) => {
    return domainParts.slice(i).join('.');
  });

  // generate a list of paths that the cookie could possibly belong to
  const pathname = globalThis.location.pathname.replace(/\/$/, ''); // strip trailing slash
  const pathParts = pathname.split('/');
  const paths = pathParts.map((pathPart, i) => {
    return pathParts.slice(0, i + 1).join('/') || '/';
  });

  // Loop over every combination of path and domain for each cookie we want to delete
  cookieNames.forEach((cookieName) => {
    paths.forEach((path) => {
      domains.forEach((domain) => {
        createCookie(cookieName, '', -1, path, domain);
      });
    });
  });
}
