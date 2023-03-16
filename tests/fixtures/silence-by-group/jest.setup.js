const failOnConsole = require('../../..')

failOnConsole({
  shouldFailOnLog: true,
  shouldFailOnError: false,
  silenceMessage: (msg, fn, context) => /^a group$/.test(context.group),
})
