describe('Example site cookie usage', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/tests/example/')
  })

  it('should load necessary cookies', async () => {
    await expect(page).toMatch('necessary=This is a necessary cookie')
  })
})
