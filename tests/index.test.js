const { exec } = require('child_process')

const fixturesDirectory = 'tests/fixtures'
const runFixture = async (fixtureName) => {
  const testFilePath = `./${fixturesDirectory}/${fixtureName}/index.test.js`
  const configFilePath = `./${fixturesDirectory}/${fixtureName}/jest.config.js`
  const cmd = `./node_modules/.bin/jest ${testFilePath} --config ${configFilePath}`

  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      resolve({ stdout, stderr })
    })
  })
}

const passString = (fixtureName) => `PASS ${fixturesDirectory}/${fixtureName}/index.test.js`

describe('jest-fail-on-console', () => {
  it('errors when console.error() is called', async () => {
    const { stderr } = await runFixture('error')

    expect(stderr).toEqual(expect.stringMatching(/Expected test not to call .*console.error().*/))
  })

  it('does not error when console.error() is called but shouldFailOnError is false', async () => {
    const { stderr } = await runFixture('error-disabled')

    expect(stderr).toEqual(expect.stringContaining(passString('error-disabled')))
  })

  it('does not error when console.error() is called and skip test by test file path returns true', async () => {
    const { stderr } = await runFixture('error-skip-test')

    expect(stderr).toEqual(expect.stringContaining(passString('error-skip-test')))
  })

  it('does not error when console.error() is called and skip test by test name returns true', async () => {
    const { stderr } = await runFixture('error-skip-test-by-name')

    expect(stderr).toEqual(expect.stringContaining(passString('error-skip-test-by-name')))
  })

  it('errors when console.assert() is called with a failing assertion', async () => {
    const { stderr } = await runFixture('assert-failure')

    expect(stderr).toEqual(expect.stringMatching(/Expected test not to call .*console.assert().*/))
  })

  it('does not error when console.assert() is called with a passing assertion', async () => {
    const { stderr } = await runFixture('assert-success')

    expect(stderr).toEqual(expect.stringContaining(passString('assert-success')))
  })

  it('does not error if message is silenced with `silenceMessage`', async () => {
    const { stderr } = await runFixture('silence-by-message')

    expect(stderr).toEqual(expect.stringContaining(passString('silence-by-message')))
  })

  it('does not error if message is silenced with `silenceMessage` based on console method', async () => {
    const { stderr } = await runFixture('silence-by-method')

    expect(stderr).toEqual(expect.stringContaining(passString('silence-by-method')))
  })

  it('does not error if message is silenced with `silenceMessage` based on group context', async () => {
    const { stderr } = await runFixture('silence-by-group')

    expect(stderr).toEqual(expect.stringContaining(passString('silence-by-group')))
  })

  it('does not error if message is silenced with `silenceMessage` based on nested group context', async () => {
    const { stderr } = await runFixture('silence-by-nested-group')

    expect(stderr).toEqual(expect.stringContaining(passString('silence-by-nested-group')))
  })

  it('does not error if message is silenced with `allowMessage`', async () => {
    const { stderr, stdout } = await runFixture('allow-message')

    expect(stdout).toContain('console.error');
    expect(stdout).toContain('my error message that I do not control');

    expect(stderr).toEqual(expect.stringContaining(passString('allow-message')))
  })

  it('prints the message to the console immediately even though fail on error is enabled', async () => {
    const { stderr, stdout } = await runFixture('print-message')

    expect(stdout).toContain('console.error');
    expect(stdout).toContain('my error message that I do not control');

    expect(stderr).toEqual(expect.stringMatching(/Expected test not to call .*console.error().*/));
  })

  it('prints the message to the console even though there is another reason the test failed', async () => {
    const { stdout } = await runFixture('print-message-with-other-failure')

    expect(stdout).toContain('console.error');
    expect(stdout).toContain('my error message that I do not control');
  })

  it('errors when console.error() called before testing has begun', async () => {
    const { stderr } = await runFixture('error-before-beforeEach')

    expect(stderr).toContain('console.error');
    expect(stderr).toContain('console error message out in the wild');
  })
})
