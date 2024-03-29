const consoleError = require('.')

describe('console.error display message but not fail (allowMessage)', () => {
  it('does not throw', () => {
    expect(consoleError).not.toThrow()
  })
})
