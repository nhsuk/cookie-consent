import { acceptConsent, askMeLater } from './cookieconsent'

//used to create a new cookie for the user which covers different cookie types
export function createCookie(name, value, days, path, domain, secure){
    //if number of days is given, sets expiry time
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires=date.toGMTString();
    }
    else {
        var expires = "";
    }
    //appends name to cookie, making it searchable
    var cookieString= name + "=" + escape (value);

    if (expires)
    cookieString += ";expires=" + expires;

    if (path)
    cookieString += ";path=" + escape (path);

    if (domain)
    cookieString += ";domain=" + escape (domain);

    if (secure)
    cookieString += ";secure";

    cookieString += ";";

    //cookiestring now contains all necessary details and is turned into a cookie
    document.cookie=cookieString;
};

//gets a cookie based on the name
export function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    return decodeURI(dc.substring(begin + prefix.length, end));
}

export function hideCookieModal() {
    document.getElementById("cookiebanner").style.display = "none";
};

export function showCookieConfirmation() {
    document.getElementById("nhsuk-cookie-confirmation-banner").style.display = "block";
};

export function insertCookieBanner() {
    document.getElementsByTagName("body")[0].innerHTML += 
        '<div class="nhsuk-cookie-banner" id="cookiebanner" role="alert">' +
        '<div class="modal-content">' + 
        '<svg class="nhsuk-logo" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false">' + 
        '<g fill="none">' +
        '<path fill="#005EB8" d="M0 39.842h98.203V0H0z"></path>' +
        '<path fill="#FFFFFF" d="M9.548 3.817H20.16l6.52 22.08h.09l4.465-22.08h8.021l-6.74 31.84H21.939l-6.65-22.032h-.09l-4.424 22.031H2.754l6.794-31.84m32.852.001h8.518l-2.502 12.18h10.069l2.508-12.18h8.519l-6.61 31.84h-8.518l2.826-13.638H47.135L44.31 35.656h-8.518L42.4 3.816m49.53 7.209c-1.64-.773-3.873-1.457-7.016-1.457-3.37 0-6.106.498-6.106 3.056 0 4.512 12.35 2.828 12.35 12.499 0 8.802-8.16 11.085-15.54 11.085-3.281 0-7.065-.78-9.842-1.648l2.006-6.477c1.682 1.096 5.058 1.827 7.835 1.827 2.646 0 6.789-.503 6.789-3.786 0-5.111-12.35-3.194-12.35-12.176 0-8.214 7.202-10.676 14.176-10.676 3.92 0 7.608.413 9.75 1.413l-2.052 6.34"></path>' +
        '</g>' +
        '<image xlink:href="" src="/assets/logos/fallback/logo-nhs.png"></image>' +
        '</svg>' +
        '<h2 id="cookie-title">Cookies on our website</h2>' +
        '<p>We have put some small files called cookies on your device.</p>' +
        '<p>They collect information about how you use our website. This helps us make the website better.</p>' +
        '<p>None of these cookies are used to tell us who you are.</p>' +
        '<div class="center-wrapper">' +
        '<div class="nhsuk-button" role="button">' +
        '<p>I understand</p>' +
        '</div>' +
        '<div class="nhsuk-link">' +
        '<a href="https://www.nhs.uk/aboutNHSChoices/aboutnhschoices/termsandconditions/Pages/cookies-policy.aspx">Tell me more about cookies</a>' +
        '</div>' +
        '<div class="nhsuk-link">' +
        '<a id="later-link">Ask me later</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div id="nhsuk-cookie-confirmation-banner" style="display:none;" role="banner">' +
        '<div class="nhsuk-width-container">' +
        '<p>Your cookie settings have been saved. <a href="https://www.nhs.uk/aboutNHSChoices/aboutnhschoices/termsandconditions/Pages/cookies-policy.aspx" style="color: #ffffff;">Change your cookie settings.</a></p>' +
        '</div>' +
        '</div>';

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
    
};
