import { clearAllCookies } from './util'

describe('Popup is usable', () => {

  const waitForVisibleBanner = async () => {
    await page.waitForSelector('.nhsuk-cookie-banner', { visible: true })
  }

  const waitForHiddenBanner = async () => {
    await page.waitForSelector('.nhsuk-cookie-banner', { hidden: true })
  }

  beforeEach(async () => {
    await clearAllCookies()
    await page.goto('http://localhost:8080/tests/example/')
    await waitForVisibleBanner()
  })

  it('should display on first page load', async () => {
    await expect(page).toMatch("Cookies on our website")
  })

  it('clicking the accept button should hide banner', async () => {
    await page.click('.nhsuk-cookie-banner button')
    await waitForHiddenBanner()
  })

  it('clicking outside of the banner should hide banner', async () => {
    // Click the cookie banner background with javascript in-browser.
    // for some reason, page.click('.nhsuk-cookie-banner') throws a pupeteer error
    // TypeError: Cannot read property 'addExpectationResult' of undefined
    await page.evaluate(async () => {
      document.querySelector('.nhsuk-cookie-banner').click()
    })
    await waitForHiddenBanner()
  })

  it('clicking "tell me more" should take the user to another page', async () => {
    await Promise.all([
      page.waitForRequest('https://www.nhs.uk/our-policies/cookies-policy/'),
      page.click('.nhsuk-link a')
    ])
  })

  it('clicking "ask me later" should hide banner', async () => {
    await page.click('#later-link')
    await waitForHiddenBanner()
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
