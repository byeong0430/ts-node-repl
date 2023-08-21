import * as chokidar from 'chokidar'
import repl from 'repl'

export interface IModuleMountOptions {
  pattern: string,
  onAfterMounted?: () => void
  onError?: (error: Error) => void
}

export interface IWatchOptions {
  paths: string | ReadonlyArray<string>
  options?: chokidar.WatchOptions
}

export interface IReplServerOptions {
  replOptions?: repl.ReplOptions
  moduleMountOptions: IModuleMountOptions,
  watchOptions: IWatchOptions
}

export interface IModuleRequireProps {
  path: string
  removeCache?: boolean
  onSuccess: (requireModules: NodeRequire) => void 
  onError?: (error: Error) => void
}

export interface IModuleMountProps {
  replServer: repl.REPLServer
  requiredModules: NodeRequire
  useGlobal?: boolean
}