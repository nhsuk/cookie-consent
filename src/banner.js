import bannerHtml from './banner.html';
import bannerCss from './style.scss';

function hideCookieBanner() {
  document.getElementById('cookiebanner').style.display = 'none';
}

function showCookieConfirmation() {
  document.getElementById('nhsuk-cookie-confirmation-banner').style.display = 'block';
}

function addFocusCookieConfirmation() {
  const cookieConfirmationMessage = document.getElementById('nhsuk-success-banner__message');
  cookieConfirmationMessage.setAttribute('tabIndex', '-1');
  cookieConfirmationMessage.focus();
}

function removeFocusCookieConfirmation() {
  const cookieConfirmationMessage = document.getElementById('nhsuk-success-banner__message');
  cookieConfirmationMessage.addEventListener('blur', () => {
    cookieConfirmationMessage.removeAttribute('tabIndex');
  });
}

/**
 * Hit a URL set up to monitor logs in Splunk
 * @param {string} route route to hit for logging
 */
function hitLoggingUrl(route) {
  const oReq = new XMLHttpRequest();
  oReq.open(
    'GET',
    `https://nhsukcookieanalytics.blob.core.windows.net/%24web/${route}`
  );
  oReq.send();
}

/**
 * Call common methods on link click as well as consent type callback
 * @param {function} consentCallback callback to be called based on which link has been clicked.
 */
function handleLinkClick(consentCallback) {
  hideCookieBanner();
  consentCallback();
  showCookieConfirmation();
  addFocusCookieConfirmation();
  removeFocusCookieConfirmation();
}

/**
 * Insert the cookie banner at the top of a page.
 * @param {function} onAccept callback that is called when necessary consent is accepted.
 * @param {function} onAnalyticsAccept callback that is called analytics consent is accepted.
 */
export default function insertCookieBanner(onAccept, onAnalyticsAccept) {
  // add a css block to the inserted html
  const div = document.createElement('div');
  div.innerHTML = bannerHtml;
  div.innerHTML += `<style>${bannerCss.toString()}</style>`;
  document.body.insertBefore(div, document.body.firstChild);
  hitLoggingUrl('display.html');

  document.getElementById('nhsuk-cookie-banner__link_accept').addEventListener('click', (e) => {
    e.preventDefault();
    hitLoggingUrl('no-consent.html');
    handleLinkClick(onAccept);
  });

  document.getElementById('nhsuk-cookie-banner__link_accept_analytics').addEventListener('click', (e) => {
    e.preventDefault();
    hitLoggingUrl('consent.html');
    handleLinkClick(onAnalyticsAccept);
  });
}
