const failOnConsole = require('../../..')

failOnConsole({
  shouldFailOnLog: true,
  silenceMessage: (msg) => /^my message$/.test(msg),
})
