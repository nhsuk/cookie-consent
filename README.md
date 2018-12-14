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

- `getPreferences` gets the status of the preferences cookie allowance
- `getStatistics` gets the status of the statistics cookie allowance
- `getMarketing` gets the status of the marketing cookie allowance
- `togglePreferences` changes the users preferences allowance to true if false and vice versa
- `toggleStatistics` changes the users statistics allowance to true if false and vice versa
- `toggleMarketing` changes the users marketing allowance to true if false and vice versa

### Properties

- `VERSION` the current version as defined in package.json

## Compiling

This project uses [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/)

To compile the javascript, run
```sh
npm run build
```

Compiled javascript will be saved to dist/main.js

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
