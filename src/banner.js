import bannerHtml from './banner.html';
import bannerCss from './style.scss';

export function hideCookieBanner() {
  document.getElementById('cookiebanner').style.display = 'none';
}

export function showCookieConfirmation() {
  document.getElementById('nhsuk-cookie-confirmation-banner').style.display = 'block';
}

/**
 * Insert the cookie banner at the top of a page.
 * args:
 *   onAccept - callback that is called when consent is accepted.
 */
export function insertCookieBanner(onAccept) {
  // add a css block to the inserted html
  const html = `${bannerHtml} <style>${bannerCss.toString()}</style>`;
  document.getElementsByTagName('body')[0].innerHTML = html + document.getElementsByTagName('body')[0].innerHTML;

  document.getElementById('nhsuk-cookie-banner__link_accept').addEventListener('click', (e) => {
    e.preventDefault();
    onAccept();
    hideCookieBanner();
    showCookieConfirmation();
  });
  document.getElementById('nhsuk-cookie-banner__link').addEventListener('click', () => {
    onAccept();
    hideCookieBanner();
  });
}
