const consoleError = require('.')

describe('console.assert failure', () => {
  it('does throw', () => {
    expect(consoleError).not.toThrow()
  })
})
