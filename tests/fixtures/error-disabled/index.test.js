const consoleError = require('.')

describe('console.error disabled', () => {
  it('does throw', () => {
    expect(consoleError).not.toThrow()
  })
})
