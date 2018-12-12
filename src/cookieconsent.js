import { getCookie, createCookie } from './cookies'
import { insertCookieBanner, hideCookieModal, showCookieConfirmation } from './modal'
import { enableScriptsByCategory, enableIframesByCategory } from './enable'
import packageJson from '../package.json'

var delimiter = "---"; //used to split cookie into information

// If cookie rules/regulations change and the cookie itself needs to change, bump this version up afterwards.
// It will then give the user the banner again to consent to the new rules
var COOKIE_VERSION = 1;
var cookieTypes = "necessary:true"+delimiter+"preferences:true"+delimiter+"statistics:true"+delimiter+"marketing:false"+"|"+COOKIE_VERSION;

window.onload = function checkCookie() {
    var cookieName = "nhsuk-cookie-consent";
    //If there isn't a user cookie, create one
    if (getCookie(cookieName) == null) {
        createCookie(cookieName, cookieTypes, 365, "/");
        insertCookieBanner();
    } else if(!isValidVersion(cookieName, COOKIE_VERSION)) {
        createCookie(cookieName, cookieTypes, 365);
        insertCookieBanner();
    }
}

//If consent is given, change value of cookie
export function acceptConsent() {
    var cookieTypesAccepted = "necessary:true"+delimiter+"preferences:true"+delimiter+"statistics:true"+delimiter+"marketing:true"+"|"+COOKIE_VERSION;
    createCookie("nhsuk-cookie-consent", cookieTypesAccepted, -1, "/");
    createCookie("nhsuk-cookie-consent", cookieTypesAccepted, 365, "/");
    hideCookieModal();
    showCookieConfirmation();
}

function getCookieVersion(name) {
    var status = getCookie(name).split('|')[1];
    return status.split(';')[0];
}

function isValidVersion(name, version) {
    if (getCookieVersion(name) == version)
        return true;
    else
        return false;
}

export function askMeLater() {
    createCookie("nhsuk-cookie-consent", cookieTypes, "", "/");
    hideCookieModal();
}


/*
 * Set the global NHSCookieConsent object that implementors of this library
 * will interact with.
 */
window.NHSCookieConsent = {
  /*
   * The version of this package as defined in the package.json
   */
  VERSION: packageJson.version,
}
