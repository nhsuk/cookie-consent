import { clearAllCookies } from './util'

describe('Banner is usable', () => {

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
    await expect(page).toMatch("We've put small files called cookies on your device")
  })

  it('clicking the accept button should hide banner', async () => {
    await page.click('#nhsuk-cookie-banner__link_accept')
    await waitForHiddenModal()
  })

  it('clicking "change cookie settings" should take the user to another page', async () => {
    await Promise.all([
      page.waitForRequest('http://localhost:8080/our-policies/cookies-policy'),
      page.click('#nhsuk-cookie-banner__link')
    ])
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
