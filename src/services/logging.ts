/**
 * Hit a URL set up to monitor logs in Splunk
 * @param {string} route route to hit for logging
 */
export function hitLoggingUrl(route: string): void {
  if (process.env.LOG_TO_SPLUNK === 'true') {
    const oReq = new XMLHttpRequest();
    oReq.open(
      'GET',
      `https://www.nhs.uk/our-policies/cookies-policy/?policy-action=${route}`,
    );
    oReq.send();
  }
}
