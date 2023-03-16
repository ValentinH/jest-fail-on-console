const consoleLog = require('.')

describe('console.log silence message by message', () => {
  it('does not throw', () => {
    expect(consoleLog).not.toThrow()
  })
})
