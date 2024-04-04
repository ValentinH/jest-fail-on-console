const failOnConsole = require('../../..')

failOnConsole({
  shouldFailOnError: true,
  allowMessage: (msg, methodName) => {
    return methodName === 'error' && /my error message that I do not control/.test(msg)
  },
})
