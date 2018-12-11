describe('Example site cookie usage', () => {
  const getCookieNames = async () => {
    const cookies = await page.cookies()
    return cookies.map(cookie => cookie.name)
  }

  beforeAll(async () => {
    await page.goto('http://localhost:8080/tests/example/')
  })

  it('should load necessary cookies', async () => {
    const cookieNames = await getCookieNames()
    expect(cookieNames).toContainEqual("necessary")
  })

  it('should not load unecessary cookeis', async () => {
    const cookieNames = await getCookieNames()
    expect(cookieNames).not.toContainEqual("unecessary")
  })

  it('one cookie should be the consent preference', async () => {
    const cookieNames = await getCookieNames()
    expect(cookieNames).toContainEqual("nhsuk-cookie-consent")
  })
})
