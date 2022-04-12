const assertFailure = require('.')

describe('console.assert failure', () => {
  it('does not throw', () => {
    expect(assertFailure).not.toThrow()
  })
})
