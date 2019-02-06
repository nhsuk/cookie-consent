import modalHtml from './modal.html';
import modalCss from './style.css';

export function hideCookieModal() {
  document.getElementById('cookiebanner').style.display = 'none';
  const header = document.getElementsByClassName('nhsuk-global-header')[0];
  header.style.marginTop = 0;
}

export function insertCookieBanner(acceptConsent) {
  // add a css block to the inserted html
  const html = `${modalHtml} <style>${modalCss.toString()}</style>`;
  let bod = document.getElementsByTagName('body')[0].innerHTML;
  bod = html + bod;

  document.getElementById('nhsuk-cookie-banner__link_accept').addEventListener('click', acceptConsent);
  const cookieBannerHeight = document.getElementById('cookiebanner').offsetHeight;
  const header = document.getElementsByClassName('nhsuk-global-header')[0];
  header.style.marginTop = cookieBannerHeight.toString() + 'px';
}
