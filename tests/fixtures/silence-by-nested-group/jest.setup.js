const failOnConsole = require('../../..')

failOnConsole({
  shouldFailOnLog: true,
  shouldFailOnError: false,
  silenceMessage: (msg, fn, context) => context.groups.includes('group one'),
})
