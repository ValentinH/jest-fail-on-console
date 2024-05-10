const consoleError = require('.')

describe('print message flag with other test failure', () => {
  it('does not throw', () => {
    expect(consoleError).not.toThrow()
  })
})
