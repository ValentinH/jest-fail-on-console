const failOnConsole = require('../../..')

failOnConsole({
  shouldFailOnError: true,
  skipTest: ({ testPath }) => /.*tests\/fixtures\/error-skip-test\/index.test.js/.test(testPath),
})
