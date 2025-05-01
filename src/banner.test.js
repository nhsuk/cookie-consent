import insertCookieBanner from './banner';

describe('Cookie Banner', () => {
  let mockOnAccept, mockOnAnalyticsAccept, mockHitLoggingUrl;

  beforeEach(() => {
    // Set up mocks
    mockOnAccept = jest.fn();
    mockOnAnalyticsAccept = jest.fn();
    mockHitLoggingUrl = jest.fn();

    document.body.innerHTML = `
      <div id="cookiebanner"></div>
      <div id="nhsuk-cookie-confirmation-banner" style="display: none;"></div>
      <div id="nhsuk-success-banner__message"></div>
      <a id="nhsuk-cookie-banner__link_accept" href="#">Accept</a>
      <a id="nhsuk-cookie-banner__link_accept_analytics" href="#">Accept Analytics</a>
    `;
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('inserts the cookie banner into the DOM', () => {
    insertCookieBanner(mockOnAccept, mockOnAnalyticsAccept, mockHitLoggingUrl);

    expect(document.body.innerHTML).toContain('<style>');
    expect(mockHitLoggingUrl).toHaveBeenCalledWith('seen');
  });
  test('handles accept link click', () => {
    insertCookieBanner(mockOnAccept, mockOnAnalyticsAccept, mockHitLoggingUrl);

    const acceptLink = document.getElementById('nhsuk-cookie-banner__link_accept');
    acceptLink.click();

    expect(mockHitLoggingUrl).toHaveBeenCalledWith('declined');
    expect(mockOnAccept).toHaveBeenCalled();
    expect(document.getElementById('cookiebanner').style.display).toBe('none');
    expect(document.getElementById('nhsuk-cookie-confirmation-banner').style.display).toBe('block');
  });

  test('handles accept analytics link click', () => {
    insertCookieBanner(mockOnAccept, mockOnAnalyticsAccept, mockHitLoggingUrl);

    const acceptAnalyticsLink = document.getElementById('nhsuk-cookie-banner__link_accept_analytics');
    acceptAnalyticsLink.click();

    expect(mockHitLoggingUrl).toHaveBeenCalledWith('accepted');
    expect(mockOnAnalyticsAccept).toHaveBeenCalled();
    expect(document.getElementById('cookiebanner').style.display).toBe('none');
    expect(document.getElementById('nhsuk-cookie-confirmation-banner').style.display).toBe('block');
  });

  test('adds focus to the confirmation message', () => {
    insertCookieBanner(mockOnAccept, mockOnAnalyticsAccept, mockHitLoggingUrl);

    const acceptLink = document.getElementById('nhsuk-cookie-banner__link_accept');
    acceptLink.click();

    const confirmationMessage = document.getElementById('nhsuk-success-banner__message');
    expect(confirmationMessage.getAttribute('tabIndex')).toBe('-1');
    expect(document.activeElement).toBe(confirmationMessage);
  });

  test('removes focus from the confirmation message on blur', () => {
    insertCookieBanner(mockOnAccept, mockOnAnalyticsAccept, mockHitLoggingUrl);

    const acceptLink = document.getElementById('nhsuk-cookie-banner__link_accept');
    acceptLink.click();

    const confirmationMessage = document.getElementById('nhsuk-success-banner__message');
    confirmationMessage.dispatchEvent(new Event('blur'));

    expect(confirmationMessage.getAttribute('tabIndex')).toBeNull();
  });
});