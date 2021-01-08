const util = require('util')
const chalk = require('chalk')

const init = ({ ignoreError }) => {
  const patchConsoleMethod = (methodName, unexpectedConsoleCallStacks) => {
    const newMethod = (format, ...args) => {
      if (ignoreError && ignoreError(format)) {
        return
      }

      // Capture the call stack now so we can warn about it later.
      // The call stack has helpful information for the test author.
      // Don't throw yet though b'c it might be accidentally caught and suppressed.
      const { stack } = new Error()
      if (stack) {
        unexpectedConsoleCallStacks.push([
          stack.substr(stack.indexOf('\n') + 1),
          util.format(format, ...args),
        ])
      }
    }

    console[methodName] = newMethod // eslint-disable-line no-console

    return newMethod
  }

  const isSpy = (spy) => spy.calls && typeof spy.calls.count === 'function'

  const flushUnexpectedConsoleCalls = (mockMethod, methodName, unexpectedConsoleCallStacks) => {
    // eslint-disable-next-line no-console
    if (console[methodName] !== mockMethod && !isSpy(console[methodName])) {
      throw new Error(`Test did not tear down console.${methodName} mock properly.
    
    If you are trying to disable the "fail on console" mechanism, you should use beforeEach/afterEach
    instead of beforeAll/afterAll
    `)
    }

    if (unexpectedConsoleCallStacks.length > 0) {
      const messages = unexpectedConsoleCallStacks.map(([stack, message]) => {
        const stackLines = stack.split('\n')
        return (
          `${chalk.red(message)}\n` +
          `${stackLines
            .map((line, index) => {
              if (index === stackLines.length - 1) {
                return chalk.white(line)
              }
              return chalk.gray(line)
            })
            .join('\n')}`
        )
      })

      const message =
        `Expected test not to call ${chalk.bold(`console.${methodName}()`)}.\n\n` +
        `If the warning is expected, test for it explicitly by mocking it out using ${chalk.bold(
          'jest.spyOn'
        )}(console, '${methodName}') and test that the warning occurs.`

      throw new Error(`${message}\n\n${messages.join('\n\n')}`)
    }
  }

  const unexpectedErrorCallStacks = []
  const unexpectedWarnCallStacks = []

  const errorMethod = patchConsoleMethod('error', unexpectedErrorCallStacks)
  const warnMethod = patchConsoleMethod('warn', unexpectedWarnCallStacks)

  const flushAllUnexpectedConsoleCalls = () => {
    flushUnexpectedConsoleCalls(errorMethod, 'error', unexpectedErrorCallStacks)
    flushUnexpectedConsoleCalls(warnMethod, 'warn', unexpectedWarnCallStacks)
    unexpectedErrorCallStacks.length = 0
    unexpectedWarnCallStacks.length = 0
  }

  const resetAllUnexpectedConsoleCalls = () => {
    unexpectedErrorCallStacks.length = 0
    unexpectedWarnCallStacks.length = 0
  }

  beforeEach(resetAllUnexpectedConsoleCalls)
  afterEach(flushAllUnexpectedConsoleCalls)
}

module.exports = init
