(function() {

    var delimiter = "---"; //used to split cookie into information

    //used to create a new cookie for the user which covers different cookie types
    function createCookie(name, value, days, path, domain, secure){
        //if number of days is given, sets expiry time
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires=date.toLocaleTimeString();
        }
        else {
            var expires = "";
        }
        //appends name to cookie, making it searchable
        cookieString= name + "=" + escape (value);

        if (expires)
        cookieString += "; expires=" + expires;

        if (path)
        cookieString += "; path=" + escape (path);

        if (domain)
        cookieString += "; domain=" + escape (domain);

        if (secure)
        cookieString += "; secure";

        //cookiestring now contains all necessary details and is turned into a cookie
        document.cookie=cookieString;
    }

    //gets a cookie based on the name
    function getCookie(name) {

        //used to split cookie name from rest of cookie
        var nameEquals = name + "=";
        var rest = document.cookie.split(nameEquals)[1].split(";")[0]; //take everything before ; at end

        var chunks = rest.split(delimiter);

        return chunks;
    }

    //function to check to see if cookie exists. Runs on every page load
    window.onload = function checkCookie() {
        //If there isn't a user cookie, create one
        if (document.cookie.indexOf("visited") == 0) {
            var cookieTypes = "necessary:true"+delimiter+"preferences:false"+delimiter+"statistics:false"+delimiter+"marketing:false";
            createCookie("visited", cookieTypes, 365);
        }
    }
    //on page loads, if no cookie, drop cookie with stamp similar to cookiebot

    //if accept has been clicked, yes to all

    //put the actual banner in here
});