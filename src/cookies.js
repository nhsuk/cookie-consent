
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
    cookieString += ";secure" + escape (secure);

    cookieString += ";";

    //cookiestring now contains all necessary details and is turned into a cookie
    document.cookie=cookieString;
};

// gets a cookie based on the name
export function getCookie(name) {
  var getCookieValues = function(cookie) {
    if (document.cookie != "") {
      var cookieArray = cookie.split('=');
      return cookieArray[1].trim();
    }
  };

  var getCookieNames = function(cookie) {
	var cookieArray = cookie.split('=');
    return cookieArray[0].trim();
  };

  var cookies = document.cookie.split(';');
  var cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)];

  return (cookieValue === undefined) ? null : decodeURIComponent(cookieValue);
}
