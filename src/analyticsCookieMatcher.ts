export const analyticsCookieWhitelist = {
  exact: [
    '_ga',
    '_gat',
    '_gid',
    'com.adobe.reactor.dataElementCookiesMigrated',
    'demdex',
    'nbs_sess',
    's_cc',
    's_getNewRepeat',
    's_ppn',
    's_sq',
    'QSI_S',
    'QSIPopUnder_PopUnderTarget_SI',
    'mbox',
    'at_check',
    'mboxEdgeCluster',
    'nhsa.adb.cid',
    'ai_session',
    'ai_user',
  ],
  patterns: ['AMCV_#', 'AMCVS_#AdobeOrg', 'QSI_SI_#_intercept'],
};

const patternMatcher = analyticsCookieWhitelist.patterns.map((pattern) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexStr = '^' + escaped.replace('#', '[^=;]+') + '$';
  return new RegExp(regexStr);
});

/**
 * Returns an array of cookie names that match the analytics rules.
 *
 * @param {string[]} cookieNames - The list of cookie names to check
 * @returns {string[]} - Filtered list of matching cookie names
 */
export function getMatchingAnalyticsCookies(cookieNames) {
  return cookieNames.filter(
    (name) =>
      analyticsCookieWhitelist.exact.includes(name) ||
      patternMatcher.some((regex) => regex.test(name))
  );
}
