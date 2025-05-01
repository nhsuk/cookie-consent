module.exports = {
  /* Incognito is important as it forces tests to be run in isolation.
   * Running outside of incognito means parallel tests will conflict.
   */
  browserContext: 'incognito',
  launch: {
    // set headless to false if you want to see the tests running locally
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
