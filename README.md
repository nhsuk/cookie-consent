# cookie-consent
In-house solution for managing cookies on nhs.uk

## Quickstart

```sh
npm install
npm start
```

Go to http://localhost:8080/tests/example/ for an example site using the cookie javascript.

## Usage

Include the cookie javascript in your page
```html
<script src="/path/to/javascript.js" type="text/javascript"></script>
```

If you want to prevent the cookie banner from showing automatically, add a
`data-nobanner` attribute to the script tag
```html
<script src="/path/to/javascript.js" data-nobanner type="text/javascript"></script>
```

If you disable the banner, you will have to write your own logic and interact with
the javascript API to set user cookie consent.

Any scripts that use cookies must be given a type="text/plain" attribute to stop the
javascript from running, and a data-cookieconsent attribute so that cookie-consent knows
which scripts to enable based on the user's consent settings.

```html
<script src="/path/to/js-that-uses-cookies.js" data-cookieconsent="marketing" type="text/plain"></script>
```

## Javascript API

The javascript API is exposed on a NHSCookieConsent global variable.

```js
// shows the current cookie consent library version
console.log(NHSCookieConsent.VERSION)
```

### Methods

`get...` Gets the status of the cookie consent for that type of cookie.  
Returns a boolean

- `getPreferences()`
- `getStatistics()`
- `getMarketing()`

`set...` Sets the status of the cookie consent for that type of cookie.  
set methods should only be used in response to a user interaction accepting that type of cookie.  
Expects a boolean `value` argument.

- `setPreferences(value)`
- `setStatistics(value)`
- `setMarketing(value)`

### Properties

- `VERSION` the current version as defined in package.json

## Compiling

This project uses [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/)

To compile the javascript in development mode, run
```sh
npm run build
```

For production mode, run
```sh
npm run build:production
```

Compiled javascript will be saved to dist/main.js

## NO_BANNER environment variable

A custom build-time `NO_BANNER` environment variable can be set to `true` which
will produce a javascript file that won't show the cookie banner to users.
Instead, consent will be implied for all cookie types

## Customising the banner URL

By default, the banner will point to '/our-policies/cookies' for the policy page.
This is to keep it consistant across the nhs.uk domains.

It is possible to customise the URL to link to your own policy page. It can be done by
adding a parameter where the cookie script is defined. E.g.

```
<script src="./cookie-consent.js" data-policy-url="URL HERE" type="text/javascript"></script>
```

It's also possible to set the POLICY_URL environment variable to a url of your choosing for the same effect.

## Tests

To run the [Jest](https://jestjs.io/en/) tests

```sh
npm test
```

To run only unit tests
```sh
npm run test:unit
```

To run only integration tests
```sh
npm run test:integration
```

N.B. The integration tests rely on there being a test server available on localhost:8080.
