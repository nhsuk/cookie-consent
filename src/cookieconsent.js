import { getCookie, createCookie } from './cookies'

var delimiter = "---"; //used to split cookie into information

//function to check to see if cookie exists. Runs on every page load
window.onload = function checkCookie() {
    var cookieName = "visited";
    //If there isn't a user cookie, create one
    if (getCookie(cookieName) == null) {
        alert("cookie does not exist");
        var cookieTypes = "necessary:true"+delimiter+"preferences:false"+delimiter+"statistics:false"+delimiter+"marketing:false";
        createCookie(cookieName, cookieTypes, 365);
    }
    else {
        alert("cookie already exists");
    }
};

//If consent is given, change value of cookie
function acceptConsent() {
    var cookieTypes = "necessary:true"+delimiter+"preferences:false"+delimiter+"statistics:false"+delimiter+"marketing:false";
}
