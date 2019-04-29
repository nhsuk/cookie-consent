// N.B document.currentScript needs to be executed outside of any callbacks
// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript#Notes
const scriptTag = document.currentScript;

// get properties from the scriptTag for the policy URL
export function getPolicyUrl() {
  let dataPolicyUrl = '/our-policies/cookies-policy';
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
