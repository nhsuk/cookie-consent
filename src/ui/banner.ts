import bannerHtml from './banner.html';
import bannerCss from './styles/style.scss';

function hideCookieBanner(): void {
  const banner = document.getElementById('cookiebanner');
  if (banner) banner.style.display = 'none';
}

function showCookieConfirmation(): void {
  const confirmation = document.getElementById(
    'nhsuk-cookie-confirmation-banner',
  );
  if (confirmation) confirmation.style.display = 'block';
}

function addFocusCookieConfirmation(): void {
  const cookieConfirmationMessage = document.getElementById(
    'nhsuk-success-banner__message',
  );
  if (!cookieConfirmationMessage) return;
  cookieConfirmationMessage.setAttribute('tabIndex', '-1');
  cookieConfirmationMessage.focus();
}

function removeFocusCookieConfirmation(): void {
  const cookieConfirmationMessage = document.getElementById(
    'nhsuk-success-banner__message',
  );
  if (!cookieConfirmationMessage) return;
  cookieConfirmationMessage.addEventListener('blur', () => {
    cookieConfirmationMessage.removeAttribute('tabIndex');
  });
}

/**
 * Call common methods on link click as well as consent type callback
 * @param {function} consentCallback callback to be called based on which link has been clicked.
 */
function handleLinkClick(consentCallback: () => void): void {
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
export default function insertCookieBanner(
  onAccept: () => void,
  onAnalyticsAccept: () => void,
  hitLoggingUrl: (status: string) => void,
): void {
  // add a css block to the inserted html
  const div = document.createElement('div');
  div.innerHTML = bannerHtml;
  div.innerHTML += `<style>${bannerCss.toString()}</style>`;
  document.body.insertBefore(div, document.body.firstChild);
  hitLoggingUrl('seen');

  document
    .getElementById('nhsuk-cookie-banner__link_accept')
    ?.addEventListener('click', (e) => {
      e.preventDefault();
      hitLoggingUrl('declined');
      handleLinkClick(onAccept);
    });

  document
    .getElementById('nhsuk-cookie-banner__link_accept_analytics')
    ?.addEventListener('click', (e) => {
      e.preventDefault();
      hitLoggingUrl('accepted');
      handleLinkClick(onAnalyticsAccept);
    });
}
