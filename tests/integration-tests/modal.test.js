describe('Popup is usable', () => {

  const clearAllCookies = async () => {
    // send clearBrowserCookies to raw devtools protocol.
    // https://github.com/GoogleChrome/puppeteer/issues/1632#issuecomment-353086292
    // need to be on localhost to clear cookies for this domain
    await page.goto('http://localhost:8080')
    await page._client.send('Network.clearBrowserCookies');
  }

  const waitForVisibleModal = async () => {
    await page.waitForSelector('.nhsuk-cookie-banner', { visible: true })
  }

  const waitForHiddenModal = async () => {
    await page.waitForSelector('.nhsuk-cookie-banner', { hidden: true })
  }

  beforeEach(async () => {
    await clearAllCookies()
    await page.goto('http://localhost:8080/tests/example/')
    await waitForVisibleModal()
  })

  it('should display on first page load', async () => {
    await expect(page).toMatch("Cookies on our website")
  })

  it('clicking the accept button should hide modal', async () => {
    await page.click('.nhsuk-cookie-banner button')
    await waitForHiddenModal()
  })

  it('clicking outside of the modal should hide modal', async () => {
    // Click the cookie banner background with javascript in-browser.
    // for some reason, page.click('.nhsuk-cookie-banner') throws a pupeteer error
    // TypeError: Cannot read property 'addExpectationResult' of undefined
    await page.evaluate(async () => {
      document.querySelector('.nhsuk-cookie-banner').click()
    })
    await waitForHiddenModal()
  })

  it('clicking "tell me more" should take the user to another page', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('.nhsuk-link a')
    ])
  })

  it('clicking "ask me later" should hide modal', async () => {
    await page.click('#later-link')
    await waitForHiddenModal()
  })

})
