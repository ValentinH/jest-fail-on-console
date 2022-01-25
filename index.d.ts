declare namespace init {
  type InitOptions = {
    /**
     * This function is called for every console warn/error.
     * If true is returned, the message will not show in the console
     * and the test won't fail.
     */
    silenceMessage?: (message: string, methodName: 'warn' | 'error' | 'log') => boolean
    /** defaults to true */
    shouldFailOnWarn?: boolean
    /** defaults to true */
    shouldFailOnError?: boolean
    /** defaults to false */
    shouldFailOnLog?: boolean
    /**
     * This function lets you define a custom error message. The methodName is the method
     * that caused the error, bold is a function that lets you bold subsets of your message.
     * example: (methodName, bold) => `console.${methodName} is not ${bold('allowed')}`
     */
    errorMessage?: (methodName: string, bold: (string) => string) => string
  }
}

declare function init(options?: init.InitOptions): void

export = init
