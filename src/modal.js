import { acceptConsent, askMeLater } from './cookieconsent'

import modalHtml from './modal.html'
import modalCss from './style.css'

export function hideCookieModal() {
    document.getElementById("cookiebanner").style.display = "none";
}

export function showCookieConfirmation() {
    document.getElementById("nhsuk-cookie-confirmation-banner").style.display = "block";
}

export function insertCookieBanner() {
    // add a css block to the inserted html
    const html = `${modalHtml} <style>${modalCss.toString()}</style>`;
    document.getElementsByTagName("body")[0].insertAdjacentHTML('afterbegin', html);

    document.getElementsByClassName("nhsuk-button")[0].addEventListener ("click", acceptConsent);
    document.getElementById("later-link").addEventListener("click", hideCookieModal);
    document.getElementById("later-link").addEventListener("click", askMeLater);

    window.onclick = function(event) {
        if (event.target == cookiebanner) {
            askMeLater();
            hideCookieModal();
        }
    };

    setTimeout(function() {
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
    }, 500);

};
