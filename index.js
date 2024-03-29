const util = require('util')

const chalk = {
  red: (str) => `\u001B[31m${str}\u001B[39m`,
  gray: (str) => `\u001B[90m${str}\u001B[39m`,
  white: (str) => `\u001B[37m${str}\u001B[39m`,
  bold: (str) => `\u001B[1m${str}\u001B[22m`,
}

const defaultErrorMessage = (methodName, bold) =>
  `Expected test not to call ${bold(`console.${methodName}()`)}.\n\n` +
  `If the ${methodName} is expected, test for it explicitly by mocking it out using ${bold(
    'jest.spyOn'
  )}(console, '${methodName}').mockImplementation() and test that the warning occurs.`

const init = ({
  errorMessage = defaultErrorMessage,
  shouldFailOnAssert = false,
  shouldFailOnDebug = false,
  shouldFailOnError = true,
  shouldFailOnInfo = false,
  shouldFailOnLog = false,
  shouldFailOnWarn = true,
  skipTest,
  silenceMessage,
  allowMessage,
} = {}) => {
  const flushUnexpectedConsoleCalls = (methodName, unexpectedConsoleCallStacks, consoleMethodStore) => {
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
      const fullErrorMessage = `${message}\n\n${messages.join('\n\n')}`

      if(typeof allowMessage === 'function' && allowMessage(fullErrorMessage, methodName)) {
        consoleMethodStore.originalMethod(fullErrorMessage)
        return;
      }

      throw new Error(fullErrorMessage)
    }
  }
  const groups = []

  const patchConsoleMethod = (methodName) => {
    const unexpectedConsoleCallStacks = []

    const captureMessage = (format, ...args) => {
      const message = util.format(format, ...args)

      if (
        silenceMessage &&
        silenceMessage(message, methodName, { group: groups[groups.length - 1], groups })
      ) {
        return
      }

      // Capture the call stack now so we can warn about it later.
      // The call stack has helpful information for the test author.
      // Don't throw yet though b'c it might be accidentally caught and suppressed.
      const { stack } = new Error()
      if (stack) {
        unexpectedConsoleCallStacks.push([
          stack.substr(stack.indexOf('\n') + 1),
          [...groups, message].join('\n'),
        ])
      }
    }

    const newAssertMethod = (assertion, format, ...args) => {
      if (assertion) {
        return
      }

      captureMessage(format, ...args)
    }

    const newGroupMethod = (label) => {
      groups.push(label || '')
    }

    const newGroupEndMethod = () => {
      groups.pop()
    }

    const methods = {
      assert: newAssertMethod,
      group: newGroupMethod,
      groupCollapsed: newGroupMethod,
      groupEnd: newGroupEndMethod,
    }

    const consoleMethodStore = {
      originalMethod: console[methodName],
      newMethod: methods[methodName] || captureMessage
    }

    const canSkipTest = () => {
      const currentTestState = expect.getState()
      const testName = currentTestState.currentTestName
      const testPath = currentTestState.testPath

      if (skipTest && skipTest({ testName, testPath })) return true

      return false
    }
    let shouldSkipTest


    beforeEach(() => {
      shouldSkipTest = canSkipTest()
      if (shouldSkipTest) return

      console[methodName] = consoleMethodStore.newMethod // eslint-disable-line no-console
      unexpectedConsoleCallStacks.length = 0
    })

    afterEach(() => {
      if (shouldSkipTest) return

      flushUnexpectedConsoleCalls(methodName, unexpectedConsoleCallStacks, consoleMethodStore)
      console[methodName] = consoleMethodStore.originalMethod
    })
  }

  beforeEach(() => {
    groups.length = 0
  })

  if (shouldFailOnAssert) patchConsoleMethod('assert')
  if (shouldFailOnDebug) patchConsoleMethod('debug')
  if (shouldFailOnError) patchConsoleMethod('error')
  if (shouldFailOnInfo) patchConsoleMethod('info')
  if (shouldFailOnLog) patchConsoleMethod('log')
  if (shouldFailOnWarn) patchConsoleMethod('warn')
  patchConsoleMethod('group')
  patchConsoleMethod('groupCollapsed')
  patchConsoleMethod('groupEnd')
}

module.exports = init
