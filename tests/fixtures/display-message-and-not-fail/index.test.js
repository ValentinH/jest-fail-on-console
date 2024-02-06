const consoleError = require('.')

describe('console.error display message but not fail', () => {
  it('does not throw', () => {
    expect(consoleError).not.toThrow()
  })
})
