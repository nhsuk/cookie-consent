import { getCookie, createCookie, insertCookieBanner } from './cookies'

var delimiter = "---"; //used to split cookie into information

window.onload = function checkCookie() {
    var cookieName = "visited";
    //If there isn't a user cookie, create one
    if (getCookie(cookieName) == null) {
        var cookieTypes = "necessary:true"+delimiter+"preferences:false"+delimiter+"statistics:false"+delimiter+"marketing:false";
        createCookie(cookieName, cookieTypes, 365);
        insertCookieBanner();
    }
};

//If consent is given, change value of cookie
function acceptConsent() {
    var cookieTypes = "necessary:true"+delimiter+"preferences:true"+delimiter+"statistics:true"+delimiter+"marketing:true";
    createCookie("visited", cookieTypes, -1);
};

function hideCookieBanner() {
    var cookiebanner = document.getElementById("cookiebanner");
    cookiebanner.style.display = "none";
};

