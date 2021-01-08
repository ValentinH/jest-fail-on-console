export type InitOptions = {
  ignoreError?: (errorMessage: string) => boolean
}
declare function init(options?: InitOptions): void

export default init
