const JSDOMEnvironment = require('jest-environment-jsdom');

module.exports = class CookieTestEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(config);
    this.global.cookieJar = this.dom.cookieJar;
  }

  teardown() {
    this.global.jsdom = null;
    return super.teardown();
  }
};
