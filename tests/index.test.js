const fs = require('fs').promises
const { exec } = require('child_process')

const fixturesDirectory = 'tests/fixtures'
const runFixture = async (fixtureName) => {
  const testFilePath = `./${fixturesDirectory}/${fixtureName}/index.test.js`
  const configFilePath = `./${fixturesDirectory}/${fixtureName}/jest.config.js`
  const cmd = `./node_modules/.bin/jest ${testFilePath} --config ${configFilePath}`

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      resolve({ stdout, stderr })
    })
  })
}

const passString = (fixtureName) => `PASS ${fixturesDirectory}/${fixtureName}/index.test.js`

describe('jest-fail-on-console', () => {
  it('errors when console.error() is called', async () => {
    const { stderr } = await runFixture('error')

    expect(stderr).toEqual(expect.stringContaining('Expected test not to call console.error().'))
  })

  it('does not error when console.error() is called but shouldFailOnError is false', async () => {
    const { stderr } = await runFixture('error-disabled')

    expect(stderr).toEqual(expect.stringContaining(passString('error-disabled')))
  })

  it('does not error when console.error() is called and skip test returns true', async () => {
    const { stderr } = await runFixture('error-skip-test')

    expect(stderr).toEqual(expect.stringContaining(passString('error-skip-test')))
  })

  it('errors when console.assert() is called with a failing assertion', async () => {
    const { stderr } = await runFixture('assert-failure')

    expect(stderr).toEqual(expect.stringContaining('Expected test not to call console.assert().'))
  })

  it('does not error when console.assert() is called with a passing assertion', async () => {
    const { stderr } = await runFixture('assert-success')

    expect(stderr).toEqual(expect.stringContaining(passString('assert-success')))
  })
})
