
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

    var strValue = JSON.stringify(value);
    //appends name to cookie, making it searchable
    var cookieString= name + "=" + escape (strValue);

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
    return decodeURIComponent(dc.substring(begin + prefix.length, end));
}
