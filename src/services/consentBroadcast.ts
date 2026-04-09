import { ConsentState, CookieMode } from '../types/consent';

const SHARED_CONSENT_QUERY = 'nhsa.sc';
const CONSENT_GIVEN = '1';
const CONSENT_NOT_GIVEN = '0';

const DOMAIN_WHITELIST = [
  'www.nhs.uk',
  'organisation.nhswebsite.nhs.uk',
  'www.nhsapp.service.nhs.uk',
  'access.login.nhs.uk',
];

function isWhitelistedDomain(domain: string): boolean {
  return DOMAIN_WHITELIST.some((whitelistedDomain) =>
    domain.endsWith(whitelistedDomain),
  );
}

/**
 * Determines if consent should be broadcasted when navigating to a link
 * @param {HTMLAnchorElement} link - The anchor element to check
 * @returns {boolean} - true if consent should be broadcasted, false otherwise
 */
export function shouldBroadcastConsent(
  link: HTMLAnchorElement | null,
): boolean {
  if (!link) {
    return false;
  }

  try {
    const targetUrl = new URL(link.href);
    const currentUrl = new URL(globalThis.location.href);

    const isSameDomainNavigation = targetUrl.hostname === currentUrl.hostname;
    const isAuthorizedDomain = isWhitelistedDomain(targetUrl.hostname);

    // Don't broadcast for same-domain navigation
    if (isSameDomainNavigation) {
      return false;
    }

    // Only broadcast to authorized external domains
    return isAuthorizedDomain;
  } catch {
    // Invalid URL, don't broadcast
    return false;
  }
}

type GetConsentSettingFn = (key: keyof ConsentState) => boolean;
type SetConsentFn = (consent: Partial<ConsentState>, mode: CookieMode) => void;

/**
 * Handles click events on links and modifies the link URL based on user consent settings,
 *
 * - Modifies the link URL to include a `nhsa.sc` query parameter based on the user's
 *   consent for 'statistics'.
 * - Only processes links if the user has given consent.
 *
 * @param {Event} event - The click event object.
 */
function createSharedConsentLinkClickHandler(
  getConsentSetting: GetConsentSettingFn,
): (event: Event) => void {
  return function handleSharedConsentLinkClick(event: Event) {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    if (!link || !shouldBroadcastConsent(link)) {
      return;
    }

    const consented = getConsentSetting('consented');
    if (!consented) {
      return;
    }

    // If consented, evaluate 'statistics' consent
    const statistics = getConsentSetting('statistics');

    // Add nhsa.sc query param based on 'statistics' flag
    const linkUrl = new URL(link.href);
    linkUrl.searchParams.set(
      SHARED_CONSENT_QUERY,
      statistics ? CONSENT_GIVEN : CONSENT_NOT_GIVEN,
    );
    link.href = linkUrl.href;
  };
}

// Store the current handler reference for cleanup
let currentHandler: ((event: Event) => void) | null = null;

/**
 * Registers a click event listener to handle internal link clicks.
 * If a link is clicked and it's eligible, it appends a query parameter `nhsa.sc`
 * to indicate analytics consent status.
 */
export function registerSharedConsentLinkHandler(
  getConsentSetting: GetConsentSettingFn,
): void {
  unregisterSharedConsentLinkHandler();
  const handler = createSharedConsentLinkClickHandler(getConsentSetting);
  currentHandler = handler;
  document.addEventListener('click', handler);
}

/**
 * Removes the currently registered shared consent link click handler.
 */
export function unregisterSharedConsentLinkHandler(): void {
  if (currentHandler) {
    document.removeEventListener('click', currentHandler);
    currentHandler = null;
  }
}

/**
 * Processes the `shared_consent` query parameter in the current URL.
 *
 * If present and valid it will apply or override the user's "statistics" cookie consent accordingly.
 * The query parameter is then removed from the URL.
 */
function deleteSharedConsentQuery(url: URL): void {
  url.searchParams.delete(SHARED_CONSENT_QUERY);
  const relativeUrl = url.pathname + url.search + url.hash;
  globalThis.history.replaceState({}, '', relativeUrl);
}

/**
 * Consumes the `nhsa.sc` shared consent query parameter from the URL.
 *
 * - If the parameter is absent, nothing is done.
 * - If the parameter is invalid (not 1 or 0), it is removed without modifying cookies.
 * - If valid and the user has not previously consented, a new session cookie is created
 *   with `statistics` set from `nhsa.sc`.
 *
 * The query parameter is removed from the URL in all cases where it is present.
 */
export function consumeSharedConsentQuery(
  isCookieConsentGiven: () => boolean,
  setConsent: SetConsentFn,
  defaultConsent: ConsentState,
  sessionMode: CookieMode,
): void {
  const url = new URL(globalThis.location.href);

  // Extract the value of the 'shared consent' query parameter
  const sharedConsent = url.searchParams.get(SHARED_CONSENT_QUERY);
  if (sharedConsent === null) {
    return;
  }

  // Check if the sharedConsent value is valid
  const isValid =
    sharedConsent === CONSENT_GIVEN || sharedConsent === CONSENT_NOT_GIVEN;

  // If the value is invalid, remove the query param and exit
  if (!isValid) {
    deleteSharedConsentQuery(url);
    return;
  }

  const overrideStatsConsent = sharedConsent === CONSENT_GIVEN;
  if (!isCookieConsentGiven()) {
    // First-time consent: set statistics consent using session cookie
    setConsent(
      { ...defaultConsent, statistics: overrideStatsConsent, consented: true },
      sessionMode,
    );
  }

  // Clean up the URL by removing the query parameter
  deleteSharedConsentQuery(url);
}
