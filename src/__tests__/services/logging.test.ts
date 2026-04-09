/* global expect, jest, beforeEach, afterEach */

import { hitLoggingUrl } from '../../services/logging';

describe('hitLoggingUrl', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let mockOpen: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    originalEnv = { ...process.env };
    mockOpen = jest.fn();
    mockSend = jest.fn();
    (globalThis as Record<string, unknown>).XMLHttpRequest = jest.fn(() => ({
      open: mockOpen,
      send: mockSend,
    }));
  });

  afterEach(() => {
    process.env = originalEnv;
    (globalThis as Record<string, unknown>).XMLHttpRequest = undefined;
  });

  test('should send a GET request to the correct URL when LOG_TO_SPLUNK is true', () => {
    process.env.LOG_TO_SPLUNK = 'true';
    const route = 'test-route';
    hitLoggingUrl(route);
    expect(mockOpen).toHaveBeenCalledWith(
      'GET',
      `https://www.nhs.uk/our-policies/cookies-policy/?policy-action=${route}`,
    );
    expect(mockSend).toHaveBeenCalled();
  });

  test('should not send a request when LOG_TO_SPLUNK is false', () => {
    process.env.LOG_TO_SPLUNK = 'false';
    const route = 'test-route';
    hitLoggingUrl(route);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });
});
