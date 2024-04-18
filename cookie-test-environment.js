import JSDOMEnvironment from 'jest-environment-jsdom';

export default class CookieTestEnvironment extends JSDOMEnvironment {
  constructor(config, options) {
    super(config, options);
    this.global.jsdom = this.dom;
    this.global.cookieJar = this.dom.cookieJar;
  }

  teardown() {
    this.global.jsdom = null;
    return super.teardown();
  }
};
