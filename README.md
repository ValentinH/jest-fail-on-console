# jest-fail-on-console

Utility to make jest tests fail when `console.error()`, `console.warn()`, etc. are used

[![version][version-badge]][package] [![Monthly downloads][npmstats-badge]][npmstats] [![MIT License][license-badge]][license] [![PRs Welcome][prs-badge]][prs]

## What problem is this solving?

Jest doesn't fail the tests when there is a `console.error`. In large codebase, we can end up with the test output overloaded by a lot of errors, warnings, etc..
To prevent this, we want to fail each test that is logging to the console. We also want to conserve a clear output of the original error.

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

### errorMessage

Use this if you want to override the default error message of this library.

```ts
// signature
type errorMessage = (
  methodName: 'assert' | 'debug' | 'error' | 'info' | 'log' | 'warn',
  bold: (string: string) => string
) => string
```

### shouldFailOnAssert

Use this to make a test fail when a `console.assert()` is logged.

- Type: `boolean`
- Default: `false`

### shouldFailOnDebug

Use this to make a test fail when a `console.debug()` is logged.

- Type: `boolean`
- Default: `false`

### shouldFailOnError

Use this to make a test fail when a `console.error()` is logged.

- Type: `boolean`
- Default: `true`

### shouldFailOnInfo

Use this to make a test fail when a `console.info()` is logged.

- Type: `boolean`
- Default: `false`

### shouldFailOnLog

Use this to make a test fail when a `console.log()` is logged.

- Type: `boolean`
- Default: `false`

### shouldFailOnWarn

Use this to make a test fail when a `console.warn()` is logged.

- Type: `boolean`
- Default: `true`

### silenceMessage

```ts
// signature
type silenceMessage = (
  message: string,
  methodName: 'assert' | 'debug' | 'error' | 'info' | 'log' | 'warn'
) => boolean
```

This function is called for every console method supported by this utility.
If `true` is returned, the message will not show in the console and the test won't fail.

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

### skipTest

Use this if you want to ignore checks introduced by this library for specific tests determined by
the return of the callback function. Return `false` if you do not want to skip console checks for
the specific test and return `true` if you would like to skip it.

```ts
const ignoreList = [/.*components\/SomeComponent.test.tsx/]
const ignoreNameList = ['some component some test name']

failOnConsole({
  skipTest: ({ testPath, testName }) => {
    for (const pathExp of ignoreList) {
      const result = pathExp.test(testPath)
      if (result) return true
    }

    if (ignoreNameList.includes(testName)) {
      return true
    }
    
    return false
  },
})
```

## License

[MIT](https://github.com/ValentinH/jest-fail-on-console/blob/master/LICENSE)

## Maintainers

This project is maintained by Valentin Hervieu.

This project was originally part of [@ricardo-ch](https://github.com/ricardo-ch/) organisation because I (Valentin) was working at Ricardo.
After leaving this company, they gracefully accepted to transfer the project to me. ❤️

## Credits

Most of the logic is taken from [React's setupTests file](https://github.com/facebook/react/blob/master/scripts/jest/setupTests.js).

[version-badge]: https://img.shields.io/npm/v/jest-fail-on-console.svg?style=flat-square
[package]: https://www.npmjs.com/package/jest-fail-on-console
[downloads-badge]: https://img.shields.io/npm/dm/jest-fail-on-console.svg?style=flat-square
[npmstats]: http://npm-stat.com/charts.html?package=jest-fail-on-console
[npmstats-badge]: https://img.shields.io/npm/dm/jest-fail-on-console.svg?style=flat-square
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license]: https://github.com/ValentinH/jest-fail-on-console/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
