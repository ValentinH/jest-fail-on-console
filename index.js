const util = require('util')
const chalk = require('chalk')

const defaultErrorMessage = (methodName, bold) =>
  `Expected test not to call ${bold(`console.${methodName}()`)}.\n\n` +
  `If the ${methodName} is expected, test for it explicitly by mocking it out using ${bold(
    'jest.spyOn'
  )}(console, '${methodName}').mockImplementation() and test that the warning occurs.`

const init = ({
  silenceMessage,
  shouldFailOnWarn = true,
  shouldFailOnError = true,
  shouldFailOnLog = false,
  errorMessage = defaultErrorMessage,
} = {}) => {
  const flushUnexpectedConsoleCalls = (methodName, unexpectedConsoleCallStacks) => {
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

      const message = errorMessage(methodName, chalk.bold)

      throw new Error(`${message}\n\n${messages.join('\n\n')}`)
    }
  }

  const patchConsoleMethod = (methodName) => {
    const unexpectedConsoleCallStacks = []

    const newMethod = (format, ...args) => {
      const message = util.format(format, ...args)
      if (silenceMessage && silenceMessage(message, methodName)) {
        return
      }

      // Capture the call stack now so we can warn about it later.
      // The call stack has helpful information for the test author.
      // Don't throw yet though b'c it might be accidentally caught and suppressed.
      const { stack } = new Error()
      if (stack) {
        unexpectedConsoleCallStacks.push([stack.substr(stack.indexOf('\n') + 1), message])
      }
    }

    let originalMethod = console[methodName]

    beforeEach(() => {
      console[methodName] = newMethod // eslint-disable-line no-console
      unexpectedConsoleCallStacks.length = 0
    })

    afterEach(() => {
      flushUnexpectedConsoleCalls(methodName, unexpectedConsoleCallStacks)
      console[methodName] = originalMethod
    })
  }

  if (shouldFailOnError) {
    patchConsoleMethod('error')
  }
  if (shouldFailOnWarn) {
    patchConsoleMethod('warn')
  }
  if (shouldFailOnLog) {
    patchConsoleMethod('log')
  }
}

module.exports = init
