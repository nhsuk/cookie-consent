import { getCookie, createCookie } from './cookies'

var delimiter = "---"; //used to split cookie into information


//If consent is given, change value of cookie
function acceptConsent() {
    var cookieTypes = "necessary:true"+delimiter+"preferences:false"+delimiter+"statistics:false"+delimiter+"marketing:false";
}
