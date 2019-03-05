import bannerHtml from './banner.html';
import bannerCss from './style.css';
import { toggleConsented as consent } from './cookieconsent';

export function hideCookieBanner() {
  document.getElementById('cookiebanner').style.display = 'none';
}

export function showCookieConfirmation() {
  document.getElementById('nhsuk-cookie-confirmation-banner').style.display = 'block';
}

function goToCookieSettings() {
  consent();
  hideCookieBanner();
}

export function insertCookieBanner(acceptConsent) {
  // add a css block to the inserted html
  const html = `${bannerHtml} <style>${bannerCss.toString()}</style>`;
  document.getElementsByTagName('body')[0].innerHTML = html + document.getElementsByTagName('body')[0].innerHTML;

  document.getElementById('nhsuk-cookie-banner__link_accept').addEventListener('click', acceptConsent);
  document.getElementById('nhsuk-cookie-banner__link').addEventListener('click', goToCookieSettings);
}
