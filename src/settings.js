// N.B document.currentScript needs to be executed outside of any callbacks
// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript#Notes
const scriptTag = document.currentScript;

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

// get properties from the scriptTag for the bannner title
export function getBannerTitle() {
  let dataBannnerTitle = 'Cookies on the NHS Website';

  if (process.env.BANNER_TITLE) {
    dataBannnerTitle = process.env.BANNER_TITLE;
  }

  if (scriptTag.getAttribute('data-banner-title')) {
    dataBannnerTitle = scriptTag.getAttribute('data-banner-title');
  }

  return dataBannnerTitle;
}

// get properties from the scriptTag for the services used
export function getServicesUsed() {
  let dataServicesUsed = 'services called Adobe Analytics, Hotjar and Google Analytics';

  if (process.env.SERVICES_USED) {
    dataServicesUsed = process.env.SERVICES_USED;
  }

  if (scriptTag.getAttribute('data-services-used')) {
    dataServicesUsed = scriptTag.getAttribute('data-services-used');
  }

  return dataServicesUsed;
}

