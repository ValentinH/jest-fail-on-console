declare namespace init {
  type ConsoleMethodName = 'assert' | 'debug' | 'error' | 'info' | 'log' | 'warn'
  type InitOptions = {
    /**
     * This function lets you define a custom error message. The methodName is the method
     * that caused the error, bold is a function that lets you bold subsets of your message.
     * example: (methodName, bold) => `console.${methodName} is not ${bold('allowed')}`
     */
    errorMessage?: (methodName: ConsoleMethodName, bold: (string: string) => string) => string

    /** @default false */
    shouldFailOnAssert?: boolean

    /** @default false */
    shouldFailOnDebug?: boolean

    /** @default true */
    shouldFailOnError?: boolean

    /** @default false */
    shouldFailOnInfo?: boolean

    /** @default false */
    shouldFailOnLog?: boolean

    /** @default true */
    shouldFailOnWarn?: boolean

    /**
     * This function is called for every console methods.
     * If true is returned, the message will not show in the console
     * and the test won't fail.
     */
    silenceMessage?: (
      message: string,
      methodName: ConsoleMethodName,
      context: { group: string; groups: string[] }
    ) => boolean

    /**
     * This function is called for every test setup and teardown to determine if the test should
     * skip console checks from this package or not.
     */
    skipTest?: (args: { testName: string; testPath: string }) => boolean

    /**
     * This function is called for every console methods.
     * If true is returned, the message will not cause the tests to fail and will be logged to the console.
     */
    allowMessage?: (
      message: string,
      methodName: ConsoleMethodName,
      context: { group: string; groups: string[] }
    ) => boolean

    /** @default false */
    shouldPrintMessage?: boolean
  }
}

declare function init(options?: init.InitOptions): void

export = init
