import modalHtml from './modal.html';
import modalCss from './style.css';
import { toggleConsented as consent } from './cookieconsent';

export function hideCookieModal() {
  document.getElementById('cookiebanner').style.display = 'none';
}

export function showCookieConfirmation() {
  document.getElementById('nhsuk-cookie-confirmation-banner').style.display = 'block';
}

function goToCookieSettings() {
  consent();
  hideCookieModal();
}

export function insertCookieBanner(acceptConsent) {
  // add a css block to the inserted html
  const html = `${modalHtml} <style>${modalCss.toString()}</style>`;
  document.getElementsByTagName('body')[0].innerHTML = html + document.getElementsByTagName('body')[0].innerHTML;

  document.getElementById('nhsuk-cookie-banner__link_accept').addEventListener('click', (e) => {
    e.preventDefault();
    acceptConsent();
  });
  document.getElementById('nhsuk-cookie-banner__link').addEventListener('click', goToCookieSettings);
}
