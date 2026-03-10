// N.B document.currentScript needs to be executed outside of any callbacks
// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript#Notes
const scriptTag = document.currentScript;
export const COOKIE_SETTINGS_URL =
  '/our-policies/cookies-policy/cookie-settings/';
const DOMAIN_WHITELIST = [
  'www.nhs.uk',
  'organisation.nhswebsite.nhs.uk',
  'www.nhsapp.service.nhs.uk',
  'access.login.nhs.uk',
];

/**
 * Checks if a domain is in the whitelist
 * @param {string} domain - The domain to check
 * @returns {boolean} - true if the domain is whitelisted, false otherwise
 */
function isWhitelistedDomain(domain) {
  return DOMAIN_WHITELIST.some((whitelistedDomain) =>
    domain.endsWith(whitelistedDomain),
  );
}

/**
 * Ideally we would use the URL API here, but IE support is lacking.
 */
export function makeUrlAbsolute(url) {
  // Setting and immediately getting the href attribute of an <a> tag might look a bit strange, but
  // the <a> will convert our possibly-relative URL to a definitely-absolute one for us.
  const link = document.createElement('a');
  link.href = url;
  return link.href;
}

// get properties from the scriptTag for noBanner
export function getNoBanner() {
  const defaults = process.env.NO_BANNER === 'true';
  if (!scriptTag) {
    return defaults;
  }

  const dataNoBanner = scriptTag.getAttribute('data-nobanner');

  // overwrite the default settings with attributes found on the <script> tag
  if (dataNoBanner === 'true' || dataNoBanner === '') {
    return true;
  }

  return defaults;
}

/**
 * Determines if consent should be broadcasted when navigating to a link
 * @param {HTMLAnchorElement} link - The anchor element to check
 * @returns {boolean} - true if consent should be broadcasted, false otherwise
 */
export function shouldBroadcastConsent(link) {
  if (!link) {
    return false;
  }

  try {
    const targetUrl = new URL(link.href);
    const currentUrl = new URL(window.location.href);

    const isSameDomainNavigation = targetUrl.hostname === currentUrl.hostname;
    const isAuthorizedDomain = isWhitelistedDomain(targetUrl.hostname);

    // Don't broadcast for same-domain navigation
    if (isSameDomainNavigation) {
      return false;
    }

    // Only broadcast to authorized external domains
    return isAuthorizedDomain;
  } catch (error) {
    // Invalid URL, don't broadcast
    return false;
  }
}
