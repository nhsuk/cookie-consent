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
 * @param {function} hitLoggingUrl function that is makes request to logging URL.
 */
export default function insertCookieBanner(onAccept, onAnalyticsAccept, hitLoggingUrl) {
  // add a css block to the inserted html
  const div = document.createElement('div');
  div.innerHTML = bannerHtml;
  div.innerHTML += `<style>${bannerCss.toString()}</style>`;
  document.body.insertBefore(div, document.body.firstChild);
  hitLoggingUrl('seen');

  document.getElementById('nhsuk-cookie-banner__link_accept').addEventListener('click', (e) => {
    e.preventDefault();
    hitLoggingUrl('declined');
    handleLinkClick(onAccept);
  });

  document.getElementById('nhsuk-cookie-banner__link_accept_analytics').addEventListener('click', (e) => {
    e.preventDefault();
    hitLoggingUrl('accepted');
    handleLinkClick(onAnalyticsAccept);
  });
}
