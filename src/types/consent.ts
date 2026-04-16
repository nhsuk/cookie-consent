export interface ConsentState {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  consented: boolean;
}

export interface ConsentCookie extends ConsentState {
  version: number;
}

export type CookieMode = 'long' | 'session';

export interface NHSCookieConsentAPI {
  VERSION: string;
  getPreferences: () => boolean;
  setPreferences: (value: boolean) => void;
  getStatistics: () => boolean;
  setStatistics: (value: boolean) => void;
  getMarketing: () => boolean;
  setMarketing: (value: boolean) => void;
  getConsented: () => boolean;
  setConsented: (value: boolean) => void;
}
