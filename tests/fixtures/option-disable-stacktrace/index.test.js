const consoleError = require('.')

describe('console.error skip test', () => {
  it('does not throw', () => {
    expect(consoleError).not.toThrow()
  })
})
