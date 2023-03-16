const failOnConsole = require('../../..')

failOnConsole({
  shouldFailOnWarn: true,
  silenceMessage: (msg, method) => method === 'warn',
})
