describe('Example site cookie usage', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/tests/example/')
  })

  it('should load necessary cookies', async () => {
    const cookies = await page.cookies()
    expect(cookies.length).toBe(1)
    expect(cookies[0].name).toBe("necessary")
  })
})
