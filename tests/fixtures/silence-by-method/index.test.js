const consoleWarn = require('.')

describe('console.warn silence message by method', () => {
  it('does not throw', () => {
    expect(consoleWarn).not.toThrow()
  })
})
