import { acceptConsent, askMeLater } from './cookieconsent'

import modalHtml from './modal.html'

export function hideCookieModal() {
    document.getElementById("cookiebanner").style.display = "none";
}

export function showCookieConfirmation() {
    document.getElementById("nhsuk-cookie-confirmation-banner").style.display = "block";
}

export function insertCookieBanner() {
    document.getElementsByTagName("body")[0].innerHTML += modalHtml;

    var css = '.nhsuk-cookie-banner { display: block; position: fixed; z-index: 20; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: black; background-color: rgba(0, 0, 0, 0.4);} ' +
    '#later-link { margin-bottom:16px;} ' +
    '.modal-content { border-radius: 4px; background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 90%;}' +
    '#cookie-desc {margin-bottom: 24px; color: #000000;}' +
    '#cookie-title { margin-top: 24px; color: #000000;}' +
    'a:not([href]) {display: inline;}' +
    '#nhsuk-cookie-confirmation-banner { background-color: #007f3b; top: 0; box-shadow: 0 -4px 0 0 #003317; display: none; margin: 0 auto; padding: 16px 0 16px 0; position: relative; width: 100%; color: #ffffff;}' +
    '#nhsuk-cookie-confirmation-banner p { margin-bottom: 0px;}' +
    '@media only screen and (max-width: 420px) {.center-wrapper { text-align: center;}}' +
    '.nhsuk-button {-webkit-appearance: none; background-color: #007f3b; border: 2px solid transparent; border-radius: 4px; box-shadow: 0 4px 0 #003317; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-weight: 600; margin-top: 0; margin: 0 auto; padding: 8px 16px; position: relative; text-align: center; vertical-align: top; width: auto;}' +
    '.nhsuk-button p { margin-top: 0px; margin-bottom: 0px;}' +
    '.nhsuk-link {padding-top: 24px;}' +
    '.nhsuk-button:link, .nhsuk-button:visited, .nhsuk-button:active, .nhsuk-button:hover {color: #ffffff; text-decoration: none;}' +
    '.nhsuk-button::-moz-focus-inner { border: 0; padding: 0;}' +
    '.nhsuk-button:hover, .nhsuk-button:focus {background-color: #00662f;}' +
    '.nhsuk-button:active { box-shadow: none; top: 4px;}' +
    '.nhsuk-button::before { background: transparent; bottom: -6px; content: ""; display: block; left: -2px; position: absolute; right: -2px; top: -2px;}' +
    '.nhsuk-button:active::before { top: -6px;}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    document.getElementsByClassName("nhsuk-button")[0].addEventListener ("click", acceptConsent);
    document.getElementById("later-link").addEventListener("click", hideCookieModal);
    document.getElementById("later-link").addEventListener("click", askMeLater);

    window.onclick = function(event) {
        if (event.target == cookiebanner) {
            askMeLater();
            hideCookieModal();
        }
    };


    // get all focusable elements in the modal
    var cookiemodal = document.querySelector('.center-wrapper'),
        inputs = cookiemodal.querySelectorAll('button, a'),
        firstinput = inputs[0],
        lastinput = inputs[inputs.length - 1];

    // set focus on first focusable element
    firstinput.focus();

    // pressing escape will close the model
    document.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode === 27) { // escape key
          hideCookieModal();
      }
    };

    // if focus is on last element, pressing tab will focus on the first element
    lastinput.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode === 9 && !evt.shiftKey) { // tab key
        evt.preventDefault();
        firstinput.focus();
      }
    }

    // if focus is on first element, shift tab will focus on the last element
    firstinput.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode === 9 && evt.shiftKey) { // shift tab
        evt.preventDefault();
        lastinput.focus();
      }
    }


};
