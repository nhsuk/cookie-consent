import { clearAllCookies } from './util'

describe('Popup is usable', () => {

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

describe('nobanner mode', () => {

  beforeEach(async () => {
    await clearAllCookies()
    await page.goto('http://localhost:8080/tests/example/no-banner.html')
  })

  it('prevents banner from showing', async () => {
    // give the banner a chance to show up
    page.waitFor(250)
    const banner = await page.evaluate(async () => {
      return document.querySelector('.nhsuk-cookie-banner')
    })
    expect(banner).toBe(null)
  })
})
