// N.B document.currentScript needs to be executed outside of any callbacks
// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript#Notes
const scriptTag = document.currentScript;
const PUBLIC_NHS_SUFFIX = 'nhs.uk';

// get properties from the scriptTag for the policy URL
export function getPolicyUrl() {
  let dataPolicyUrl = '/our-policies/cookies-policy/';
  if (process.env.POLICY_URL) {
    dataPolicyUrl = process.env.POLICY_URL;
  }

  if (!scriptTag) {
    return dataPolicyUrl;
  }

  if (scriptTag.getAttribute('data-policy-url')) {
    dataPolicyUrl = scriptTag.getAttribute('data-policy-url');
  }

  return dataPolicyUrl;
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
  const defaults = (process.env.NO_BANNER === 'true');
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
 * Determines if a link should be skipped from further processing
 * @param {HTMLAnchorElement} link - The anchor element to check
 * @returns {boolean} - Whether the link should be skipped
 */
export function shouldSkipLinkProcessing(link) {
  if (!link) {
    return true;
  }

  try {
    const linkUrl = new URL(link.href);

    // Check if the link is to an external hostname
    const isExternalLink = linkUrl.hostname.endsWith(PUBLIC_NHS_SUFFIX) == false;
    // Check if the link is to the policy page
    const isPolicyPage = linkUrl.href.endsWith(getPolicyUrl());

    return isExternalLink || isPolicyPage;
  } catch (error) {
    // not a valid URL, so we can't process it
    return true;
  }
}
