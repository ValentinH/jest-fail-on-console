const assertSuccess = require('.')

describe('console.assert success', () => {
  it('does not throw', () => {
    expect(assertSuccess).not.toThrow()
  })
})
