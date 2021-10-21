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
  }
}

declare function init(options?: init.InitOptions): void

export = init
