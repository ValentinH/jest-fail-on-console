const failOnConsole = require('../../..')

failOnConsole({
  shouldFailOnError: true,
  displayMessageAndNotFail: (msg, methodName) => {
    return methodName === 'error' && /my error message that I do not control/.test(msg)
  },
})
