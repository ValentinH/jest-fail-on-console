const failOnConsole = require('../../..')

failOnConsole({
  shouldFailOnError: true,
  skipTest: ({ testName }) => testName === 'console.error skip test does not throw',
})
