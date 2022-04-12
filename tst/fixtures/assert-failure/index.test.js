const assertSuccess = require('.')

describe('console.assert failure', () => {
  it('does not throw', () => {
    expect(assertSuccess).not.toThrow()
  })
})
