# jest-fail-on-console

Utility to make jest tests fail when console.error() or console.warn() are used

[![version][version-badge]][package] [![Monthly downloads][npmstats-badge]][npmstats] [![MIT License][license-badge]][license] [![PRs Welcome][prs-badge]][prs]

## What problem is this solving?

Jest doesn't fail the tests when there is a `console.error`. In large codebase, we can end up with the test output overloaded by a lot of errors and warnings.
To prevent this, we want to fail each test that is logging an error or a warning to the console. We also want to conserve a clear output of the original error.

This is what this utility is doing.
![image](https://user-images.githubusercontent.com/2678610/104045400-cbe05b80-51de-11eb-820c-b96190bbff7f.png)

## Install

```shell
yarn add -D jest-fail-on-console
```

or

```shell
npm install -D jest-fail-on-console
```

## How to use

In a file used in the `setupFilesAfterEnv` option of Jest, add this code:

```ts
import failOnConsole from 'jest-fail-on-console'

failOnConsole()

// or with options:
failOnConsole({
  shouldFailOnWarn: false,
})
```

## But I have some expected console errors/warning

If a `console.error()` is expected, then you should assert for it:

```ts
test('should log an error', () => {
  jest.spyOn(console, 'error').mockImplementation()
  // do your logic
  expect(console.error).toHaveBeenCalledWith('your error message')
})
```

## Options

You can pass an object with options to the function:

### shouldFailOnWarn

Use this to make a test fail when a warning is logged.

- Type: `boolean`
- Default: `true`

### shouldFailOnError

Use this to make a test fail when an error is logged.

- Type: `boolean`
- Default: `true`

### shouldFailOnLog

Use this to make a test fail when a message is logged.

- Type: `boolean`
- Default: `false`

### silenceMessage

- Signature: `(message: string, methodName: 'warn' | 'error') => boolean`

This function is called for every console warn/error.
If true is returned, the message will not show in the console and the test won't fail.

Example:

```ts
failOnConsole({
  silenceMessage: (errorMessage) => {
    if (/Not implemented: navigation/.test(errorMessage)) {
      return true
    }
    return false
  },
})
```

## Credits

Most of the logic is taken from [React's setupTests file](https://github.com/facebook/react/blob/master/scripts/jest/setupTests.js).

[version-badge]: https://img.shields.io/npm/v/jest-fail-on-console.svg?style=flat-square
[package]: https://www.npmjs.com/package/jest-fail-on-console
[downloads-badge]: https://img.shields.io/npm/dm/jest-fail-on-console.svg?style=flat-square
[npmstats]: http://npm-stat.com/charts.html?package=jest-fail-on-console
[npmstats-badge]: https://img.shields.io/npm/dm/jest-fail-on-console.svg?style=flat-square
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license]: https://github.com/ricardo-ch/jest-fail-on-console/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
