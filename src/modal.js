/* eslint-disable no-param-reassign */
import modalHtml from './modal.html';
import modalCss from './style.css';

export function hideCookieModal() {
  document.getElementById('cookiebanner').style.display = 'none';
}

// confirmation banner is the green banner that appears after the user accepts consent
export function showCookieConfirmation() {
  document.getElementById('nhsuk-cookie-confirmation-banner').style.display = 'block';
}

// uses modal.html and style.css to load custom modal/banner
export function insertCookieBanner(acceptConsent, askMeLater) {
  // add a css block to the inserted html
  const html = `${modalHtml} <style>${modalCss.toString()}</style>`;
  document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', html);

  document.getElementsByClassName('nhsuk-button')[0].addEventListener('click', acceptConsent);
  document.getElementById('later-link').addEventListener('click', hideCookieModal);
  document.getElementById('later-link').addEventListener('click', askMeLater);

  const cookiebanner = document.getElementById('cookiebanner');

  // If the user clicks away from the modal, close it until next session
  window.onclick = function windowOnClick(event) {
    if (event.target === cookiebanner) {
      askMeLater();
      hideCookieModal();
    }
  };

  setTimeout(() => {
    // get all focusable elements in the modal

    // get all focusable elements in the modal
    const cookiemodal = document.querySelector('.center-wrapper');

    const inputs = cookiemodal.querySelectorAll('button, a');

    const firstinput = inputs[0];

    const lastinput = inputs[inputs.length - 1];

    // set focus on first focusable element
    firstinput.focus();

    // pressing escape will close the model
    document.onkeydown = function onEscapeKey(evt) {
      evt = evt || window.event;
      if (evt.keyCode === 27) { // escape key
        hideCookieModal();
      }
    };

    // if focus is on last element, pressing tab will focus on the first element
    lastinput.onkeydown = function onTabKey(evt) {
      evt = evt || window.event;
      if (evt.keyCode === 9 && !evt.shiftKey) { // tab key
        evt.preventDefault();
        firstinput.focus();
      }
    };

    // if focus is on first element, shift tab will focus on the last element
    firstinput.onkeydown = function onShiftAndTabKeys(evt) {
      evt = evt || window.event;
      if (evt.keyCode === 9 && evt.shiftKey) { // shift tab
        evt.preventDefault();
        lastinput.focus();
      }
    };
  }, 500);
}
