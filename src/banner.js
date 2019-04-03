/* eslint-disable no-else-return */
import bannerHtml from './banner.html';
import bannerCss from './style.scss';

export function hideCookieBanner() {
  document.getElementById('cookiebanner').style.display = 'none';
}

export function showCookieConfirmation() {
  document.getElementById('nhsuk-cookie-confirmation-banner').style.display = 'block';
}

export function addFocusCookieConfirmation() {
  const cookieConfirmationMessage = document.getElementById('nhsuk-success-banner__message');
  cookieConfirmationMessage.setAttribute('tabIndex', '-1');
  cookieConfirmationMessage.focus();
}

export function removeFocusCookieConfirmation() {
  const cookieConfirmationMessage = document.getElementById('nhsuk-success-banner__message');
  cookieConfirmationMessage.addEventListener('blur', (e) => {
    cookieConfirmationMessage.removeAttribute('tabIndex');
  });
}

export function getPolicyUrl() {
  // get the policy url if defined in the script
  const dataPolicyScript = document.currentScript;

  const defaultURL = './our-policies/cookies-policy';

  if (dataPolicyScript.getAttribute('data-policy-url')) {
    // always use defined URL in base html first
    return dataPolicyScript.getAttribute('data-policy-url');
  } else if (process.env.POLICY_URL) {
    // secondly, check for an env variable for the URL
    return process.env.POLICY_URL;
  }
  // if other two are not set, us the nhs.uk default URL
  return defaultURL;
}

/**
 * Insert the cookie banner at the top of a page.
 * args:
 *   onAccept - callback that is called when consent is accepted.
 */
export function insertCookieBanner(onAccept) {
  // add a css block to the inserted html
  const div = document.createElement('div');
  div.innerHTML = bannerHtml;
  div.innerHTML += `<style>${bannerCss.toString()}</style>`;
  document.body.insertBefore(div, document.body.firstChild);

  document.getElementById('nhsuk-cookie-banner__link_accept').addEventListener('click', (e) => {
    e.preventDefault();
    onAccept();
    hideCookieBanner();
    showCookieConfirmation();
    addFocusCookieConfirmation();
    removeFocusCookieConfirmation();
  });
  document.getElementById('nhsuk-cookie-banner__link').addEventListener('click', () => {
    hideCookieBanner();
  });
}
