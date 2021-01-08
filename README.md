# jest-fail-on-console

Utility to make jest tests fail when console.error() or console.warn() are used

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
```

## Options

You can pass an object with options to the function:

### ignoreError

Signature: `(errorMessage: string) => boolean`

This will be call for every error. If you return true, the test will not fail.

Example:

```ts
failOnConsole({
  ignoreError: (errorMessage) => {
    if (/Not implemented: navigation/.test(errorMessage)) {
      return true
    }
    return false
  },
})
```

## Credits

Most of the logic is taken from [React's setupTests file](https://github.com/facebook/react/blob/master/scripts/jest/setupTests.js).
