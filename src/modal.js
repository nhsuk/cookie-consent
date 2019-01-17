import modalHtml from './modal.html';
import modalCss from './style.css';

export function hideCookieModal() {
  document.getElementById('cookiebanner').style.display = 'none';
}

export function showCookieConfirmation() {
  document.getElementById('nhsuk-cookie-confirmation-banner').style.display = 'block';
}

export function insertCookieBanner(acceptConsent, askMeLater) {
  // add a css block to the inserted html
  const html = `${modalHtml} <style>${modalCss.toString()}</style>`;
  document.getElementsByTagName('body')[0].innerHTML += html;

  document.getElementsByClassName('nhsuk-accept')[0].addEventListener('click', acceptConsent);

  const cookiebanner = document.getElementById('cookiebanner');

  window.onclick = function windowOnClick(event) {
    if (event.target === cookiebanner) {
      askMeLater();
      hideCookieModal();
    }
  };
}
