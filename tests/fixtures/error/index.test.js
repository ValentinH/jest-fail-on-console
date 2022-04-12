const consoleError = require('.')

describe('console.error', () => {
  it('does throw', () => {
    expect(consoleError).not.toThrow()
  })
})
