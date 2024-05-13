const consoleError = require('.')

describe('print message flag', () => {
  it('does not throw', () => {
    expect(consoleError).not.toThrow()
  })
})
