const consoleGroup = require('.')

describe('console.group silence message', () => {
  it('does not throw', () => {
    expect(consoleGroup).not.toThrow()
  })
})
