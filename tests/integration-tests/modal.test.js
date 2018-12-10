describe('Popup is usable', () => {

  const clearAllCookies = async () => {
    const cookies = await page.cookies()
    const operations = cookies.map(async cookie => {
      await page.deleteCookie(cookie)
    })
    await Promise.all(operations)
  }

  const waitForVisibleModal = async () => {
    await page.waitForSelector('.nhsuk-cookie-banner', { visible: true })
  }

  const waitForHiddenModal = async () => {
    await page.waitForSelector('.nhsuk-cookie-banner', { hidden: true })
  }

  beforeEach(async () => {
    await page.goto('http://localhost:8080/tests/example/')
    await waitForVisibleModal()
  })

  afterEach(async () => {
    await clearAllCookies()
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
})
