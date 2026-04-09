import { getMatchingAnalyticsCookies } from '../src/analyticsCookieMatcher';

describe('getMatchingAnalyticsCookies', () => {
  it('returns exact matches only', () => {
    const input = ['_ga', '_gid', 's_sq', 'non_tracking'];
    const result = getMatchingAnalyticsCookies(input);
    expect(result).toEqual(['_ga', '_gid', 's_sq']);
  });

  it('returns pattern matches only', () => {
    const input = [
      'AMCV_123ABC',
      'AMCVS_ABC@AdobeOrg',
      'QSI_SI_9WECynKj7daEsPr_intercept',
      'not_a_match',
    ];
    const result = getMatchingAnalyticsCookies(input);
    expect(result).toEqual([
      'AMCV_123ABC',
      'AMCVS_ABC@AdobeOrg',
      'QSI_SI_9WECynKj7daEsPr_intercept',
    ]);
  });

  it('returns both exact and pattern matches', () => {
    const input = [
      '_ga',
      'AMCVS_ABC@AdobeOrg',
      'random_cookie',
      'QSI_SI_XYZ_intercept',
    ];
    const result = getMatchingAnalyticsCookies(input);
    expect(result).toEqual([
      '_ga',
      'AMCVS_ABC@AdobeOrg',
      'QSI_SI_XYZ_intercept',
    ]);
  });
  it('returns empty array if no matches', () => {
    const input = ['user_session', 'csrftoken', 'foo_bar'];
    const result = getMatchingAnalyticsCookies(input);
    expect(result).toEqual([]);
  });

  it('handles empty input array', () => {
    const result = getMatchingAnalyticsCookies([]);
    expect(result).toEqual([]);
  });
});
