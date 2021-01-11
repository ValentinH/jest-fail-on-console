export type InitOptions = {
  /**
   * This function is called for every console warn/error.
   * If true is returned, the message will not show in the console
   * and the test won't fail.
   */
  silenceMessage?: (message: string, methodName: 'warn' | 'error') => boolean
  /** defaults to true */
  shouldFailOnWarn?: boolean
  /** defaults to true */
  shouldFailOnError?: boolean
}
declare function init(options?: InitOptions): void

export default init
