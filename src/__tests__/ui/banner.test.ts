import insertCookieBanner from '../../ui/banner';

describe('Cookie Banner', () => {
  let mockOnAccept: jest.Mock,
    mockOnAnalyticsAccept: jest.Mock,
    mockHitLoggingUrl: jest.Mock;

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

    insertCookieBanner(mockOnAccept, mockOnAnalyticsAccept, mockHitLoggingUrl);
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('inserts the cookie banner into the DOM - snapshot', () => {
    expect(document.body.innerHTML).toMatchSnapshot();
  });
  test('inserts the cookie banner into the DOM', () => {
    expect(document.body.innerHTML).toContain('<style>');
    expect(mockHitLoggingUrl).toHaveBeenCalledWith('seen');
  });
  test('handles accept link click', () => {
    const acceptLink = document.getElementById(
      'nhsuk-cookie-banner__link_accept',
    )!;
    acceptLink.click();

    expect(mockHitLoggingUrl).toHaveBeenCalledWith('declined');
    expect(mockOnAccept).toHaveBeenCalled();
    expect(document.getElementById('cookiebanner')?.style.display).toBe('none');
    expect(
      document.getElementById('nhsuk-cookie-confirmation-banner')?.style
        .display,
    ).toBe('block');
  });

  test('handles accept analytics link click', () => {
    const acceptAnalyticsLink = document.getElementById(
      'nhsuk-cookie-banner__link_accept_analytics',
    )!;
    acceptAnalyticsLink.click();

    expect(mockHitLoggingUrl).toHaveBeenCalledWith('accepted');
    expect(mockOnAnalyticsAccept).toHaveBeenCalled();
    expect(document.getElementById('cookiebanner')?.style.display).toBe('none');
    expect(
      document.getElementById('nhsuk-cookie-confirmation-banner')?.style
        .display,
    ).toBe('block');
  });

  test('adds focus to the confirmation message', () => {
    const acceptLink = document.getElementById(
      'nhsuk-cookie-banner__link_accept',
    )!;
    acceptLink.click();

    const confirmationMessage = document.getElementById(
      'nhsuk-success-banner__message',
    )!;
    expect(confirmationMessage.getAttribute('tabIndex')).toBe('-1');
    expect(document.activeElement).toBe(confirmationMessage);
  });

  test('removes focus from the confirmation message on blur', () => {
    const acceptLink = document.getElementById(
      'nhsuk-cookie-banner__link_accept',
    )!;
    acceptLink.click();

    const confirmationMessage = document.getElementById(
      'nhsuk-success-banner__message',
    )!;
    confirmationMessage.dispatchEvent(new Event('blur'));

    expect(confirmationMessage.getAttribute('tabIndex')).toBeNull();
  });

  it.each`
    description                                 | elementId                             | clickId                                         | callbackType
    ${'banner element is missing'}              | ${'cookiebanner'}                     | ${'nhsuk-cookie-banner__link_accept'}           | ${'accept'}
    ${'confirmation banner element is missing'} | ${'nhsuk-cookie-confirmation-banner'} | ${'nhsuk-cookie-banner__link_accept_analytics'} | ${'analytics'}
    ${'success message element is missing'}     | ${'nhsuk-success-banner__message'}    | ${'nhsuk-cookie-banner__link_accept'}           | ${'accept'}
  `(
    'does not throw when $description',
    ({ elementId, clickId, callbackType }) => {
      document.getElementById(elementId)?.remove();
      const link = document.getElementById(clickId)!;

      expect(() => link.click()).not.toThrow();
      if (callbackType === 'accept') {
        expect(mockOnAccept).toHaveBeenCalled();
      } else {
        expect(mockOnAnalyticsAccept).toHaveBeenCalled();
      }
    },
  );
});
