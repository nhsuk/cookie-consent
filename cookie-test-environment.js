const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

module.exports = class CookieTestEnvironment extends JSDOMEnvironment {
  constructor(config, options) {
    super(config, options);
    this.global.cookieJar = this.dom.cookieJar;
  }

  teardown() {
    this.global.jsdom = null;
    return super.teardown();
  }
};
