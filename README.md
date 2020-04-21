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

Any scripts that use cookies must be given a type="text/plain" attribute to stop the
javascript from running, and a data-cookieconsent attribute so that cookie-consent knows
which scripts to enable based on the user's consent settings.

Possible data-cookieconsent values are `preferences`, `statistics` and `marketing`.

```html
<script src="/path/to/js-that-uses-cookies.js" data-cookieconsent="marketing" type="text/plain"></script>
```

### Script Options

#### `data-no-banner`

If you want to prevent the cookie banner from showing automatically, add a
`data-nobanner` attribute to the script tag.

```html
<script src="./cookie-consent.js" data-nobanner type="text/javascript"></script>
```

If you disable the banner, you will have to write your own logic and interact with
the javascript API to set user cookie consent.

#### `data-policy-url`

By default, the cookie policy link takes users to `/our-policies/cookies-policy/`.
If you need the link to use a different url, you can set the `data-policy-url` attribute.

```html
<script src="./cookie-consent.js" data-policy-url="/custom/policy/url" type="text/javascript"></script>
```

The cookie banner will not show on the policy page, even if you have embedded the cookie-consent.js script.
This is because the user does not need to be presented with a cookie banner if they are on the page
which can manage cookies.

### `data-banner-title`

By default the banner title reads "Cookies on the NHS website". If you want this to be different (for example, this is being deployed to a subsite), you can set this variable.

```html
<script src="./cookie-consent.js" data-banner-title="Cookies on the NHSX Website" type="text/javascript"></script>
```

### `data-services-used`

By default, the banner tells users the site collects cookies for "services called Adobe Analytics, Hotjar and Google Analytics". If this differs for your site, you can set this variable:

```html
<script src="./cookie-consent.js" data-services-used="Google Analytics" type="text/javascript"></script>
```

## Javascript API

The javascript API is exposed on a NHSCookieConsent global variable.

```js
// shows the current cookie consent library version
console.log(NHSCookieConsent.VERSION)
```

### Methods

- `getPreferences()`
- `getStatistics()`
- `getMarketing()`

These methods get the status of the cookie consent for that type of cookie.
Returns a boolean.

- `getConsented()`

This method gets the status of whether the user has positively interacted with the banner.
It is primarily used to hide the banner once consent has been given.

- `setPreferences(value)`
- `setStatistics(value)`
- `setMarketing(value)`

These methods set the status of the cookie consent for that type of cookie.
set methods should only be used in response to a user interaction accepting that type of cookie.
Expects a boolean `value` argument.

- `setConsented(value)`

This method is used to set the consent that the user has given.
It should be set to true when the user has taken an action which gives their consent.
It should not be used to make the banner appear again for a user, as that is handled by the
expiry date of the cookie.

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

### Environment variables

Environment variables can be used at compile-time to change the cookie script behaviour.

#### `NO_BANNER`

Set to `true` to produce a javascript file that doesn't show the cookie banner.
Instead consent will be implied for all cookie types.

```sh
NO_BANNER=true npm run build:production
```

#### `POLICY_URL`

By default, the cookie policy link takes users to `/our-policies/cookies-policy/`.
If you need the link to use a different url, you can set this variable

```sh
POLICY_URL=/custom/policy/url/ npm run build:production
```

#### `LOG TO SPLUNK`

Set to `true` a logging URL will be hit when the banner shown, analytics are accepted or analytics are not accepted.
```sh
LOG_TO_SPLUNK=true npm run build:production
```

#### `BANNER_TITLE`

By default the banner title reads "Cookies on the NHS website". If you want this to be different (for example, this is being deployed to a subsite), you can set this variable.

```sh
BANNER_TITLE="Cookies on the NHSX website" npm build:production
```

#### `SERVICES_USED`

By default, the banner tells users the site collects cookies for "services called Adobe Analytics, Hotjar and Google Analytics". If this differs for your site, you can set this variable:

```sh
SERVICES_USED="Google Analytics" npm build:production
```

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

## Contributing to a release.

A new Tag must be made for the release following the versioning format.
We use Semantic Versioning.
IE. x.y.z where:
x = Major version that causes incompatibilities,
y = Minor change that adds a backwards comptible feature,
z = Patch version for backwards compatible fixes.
more information can be found at https://semver.org/

The release also must contain changes to the package version number to match the new tag.

If the release contains a change that will require the banner to be redisplayed to users, then the `COOKIE_VERSION` variable in cookieconsent.js must be increased by 1.

## Notes
Currently, in-house development for this solution is primarily done on UNIX systems.
There may be some difficulties when developing this solution on a windows machine.
