import { NHSCookieConsentAPI } from './consent';

declare global {
  var NHSCookieConsent: NHSCookieConsentAPI;
  var inlineJsEnabled: boolean;
  var cookieJar: { removeAllCookiesSync(): void };
}

// babel-plugin-rewire augments every module with a default export containing these methods.
interface RewireAPI {
  __get__<T = unknown>(name: string): T;
  __Rewire__(name: string, value: unknown): void;
  __ResetDependency__(name: string): void;
}

/**
 * cookieJar is injected globally by the Jest test environment (jest-environment-jsdom).
 * It provides direct access to the underlying tough-cookie CookieJar instance.
 */
declare const cookieJar: {
  removeAllCookiesSync(): void;
};
