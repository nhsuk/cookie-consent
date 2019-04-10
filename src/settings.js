// N.B document.currentScript needs to be executed outside of any callbacks
// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript#Notes
const scriptTag = document.currentScript;

/**
 * Get properties from the script tag that is including this javascript
 */
function getScriptSettings() {
  const defaults = {
    nobanner: false,
    policyUrl: './our-policies/cookies-policy',
  };
  if (!scriptTag) {
    return defaults;
  }

  const dataNobanner = scriptTag.getAttribute('data-nobanner');
  let dataPolicyUrl = '';

  if (scriptTag.getAttribute('data-policy-url')) {
    dataPolicyUrl = scriptTag.getAttribute('data-policy-url');
  } else if (process.env.POLICY_URL) {
    dataPolicyUrl = process.env.POLICY_URL;
  } else {
    dataPolicyUrl = './our-policies/cookies-policy';
  }

  // overwrite the default settings with attributes found on the <script> tag
  return {
    ...defaults,
    nobanner: dataNobanner === 'true' || dataNobanner === '',
    policyUrl: dataPolicyUrl,
  };
}

export function getPolicyUrl() {
  return getScriptSettings().policyUrl;
}

export function getNoBanner() {
  return getScriptSettings().nobanner;
}
