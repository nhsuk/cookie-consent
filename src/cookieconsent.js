import { getCookie, createCookie, insertCookieBanner, hideCookieModal, showCookieConfirmation } from './cookies'

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
    }
    else {
        if (isValidVersion(cookieName, COOKIE_VERSION))
        {
            
        }
        else
        {
            createCookie(cookieName, cookieTypes, 365);
            insertCookieBanner();
        }
    }
};

//If consent is given, change value of cookie
export function acceptConsent() {
    var cookieTypesAccepted = "necessary:true"+delimiter+"preferences:true"+delimiter+"statistics:true"+delimiter+"marketing:true"+"|"+COOKIE_VERSION;
    createCookie("nhsuk-cookie-consent", cookieTypesAccepted, -1, "/");
    createCookie("nhsuk-cookie-consent", cookieTypesAccepted, 365, "/");
    hideCookieModal();
    showCookieConfirmation();
};

function getCookieVersion(name) {
    var status = getCookie(name).split('|')[1];
    return status.split(';')[0];
    console.log("status");
    return status;
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


