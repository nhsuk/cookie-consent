import { getCookie, createCookie } from './cookies'
import { insertCookieBanner, hideCookieModal, showCookieConfirmation } from './modal'
import packageJson from '../package.json'

var delimiter = "---"; //used to split cookie into information

// If cookie rules/regulations change and the cookie itself needs to change, bump this version up afterwards.
// It will then give the user the banner again to consent to the new rules
export var COOKIE_VERSION = 1;
var cookieTypes = {
    "Necessary": true,
    "Preferences": true,
    "Statistics": true,
    "Marketing": false,
    "Version": COOKIE_VERSION,
};

window.onload = function checkCookie() {
    var cookieName = "nhsuk-cookie-consent";
    console.log(getCookie("nhsuk-cookie-consent"));
    console.log(getPreferences({"Necessary":true,"Preferences":true,"Statistics":true,"Marketing":false,"Version":1}));
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
    // On a domain where marketing cookies are required, toggleMarketing() would go here
    hideCookieModal();
    showCookieConfirmation();
}

function getCookieVersion(name) {
    var status = getCookie(name).split('|')[1];
    return status.split(';')[0];
}

function isValidVersion(name, version) {
    if (getCookieVersion(name) <= version)
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

  getPreferences,
  getStatistics,
  getMarketing,
  togglePreferences,
  toggleStatistics,
  toggleMarketing,
};

// Can use getCookie beforehand to get a cookie object from a name
function getPreferences(cookie) {
    return cookie.Preferences;
};

function getStatistics(cookie) {
    return cookie.Statistics;
};

function getMarketing(cookie) {
    return cookie.Marketing;
};

function togglePreferences(cookie) {
    var cookie = JSON.parse(cookie);
    cookie.Preferences = !cookie.Preferences;
    createCookie(name, JSON.stringify(cookie), 365);
};

function toggleStatistics(name) {
    var cookie = JSON.parse(cookie);
    cookie.Statistics = !cookie.Statistics;
    createCookie(name, JSON.stringify(cookie), 365);
};

function toggleMarketing(name) {
    var cookie = JSON.parse(cookie);
    cookie.Marketing = !cookie.Marketing;
    createCookie(name, JSON.stringify(cookie), 365);
};
