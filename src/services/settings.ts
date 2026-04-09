// N.B document.currentScript needs to be executed outside of any callbacks
// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript#Notes
const scriptTag = document.currentScript;
export const COOKIE_SETTINGS_URL = '/our-policies/choose-your-cookie-settings/';

// get properties from the scriptTag for noBanner
export function getNoBanner(): boolean {
  const defaults = process.env.NO_BANNER === 'true';
  if (!scriptTag) {
    return defaults;
  }

  const dataNoBanner = scriptTag.dataset.nobanner;

  // overwrite the default settings with attributes found on the <script> tag
  if (dataNoBanner === 'true' || dataNoBanner === '') {
    return true;
  }

  return defaults;
}
