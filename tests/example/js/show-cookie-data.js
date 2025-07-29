/**
 * function for displaying cookie information on the example pages.
 * This isn't as nice as the chrome dev tools panel, but it's something.
 *
 * Looks for an element with id="cookie-list" to insert cookie data into.
 * Looks for an element with id="cookie-list-refresh" to use as a refresh button.
 */
(function showCookieData() {
  var container = document.getElementById('cookie-list');
  var refreshButton = document.getElementById('cookie-list-refresh');

  function listCookies() {
    // Get all cookies and render them in the cookie-list div
    var cookies = document.cookie ? document.cookie.split(';') : [];

    // set the cookie list
    container.innerHTML = '';
    if (cookies.length) {
      cookies.forEach(function forEachCookie(cookie) {
        var lineItem = '<li>' + cookie + '</li>';
        container.insertAdjacentHTML('beforeend', lineItem);
      });
    } else {
      container.innerHTML = '<p>No cookies to show</p>';
    }
  }
  refreshButton.addEventListener('click', listCookies);

  setTimeout(listCookies, 50);
})();
