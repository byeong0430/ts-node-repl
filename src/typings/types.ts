import * as chokidar from 'chokidar'
import { REPLCommand, REPLServer, ReplOptions } from 'repl'

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
  replOptions?: ReplOptions
  moduleMountOptions: IModuleMountOptions,
  watchOptions: IWatchOptions
}

export interface IModuleRequireProps {
  path: string
  removeCache?: boolean
  onError?: (error: Error) => void
}

export interface IModuleMountProps {
  replServer: REPLServer
  requiredModules: NodeRequire
  useGlobal?: boolean
}

export interface IREPLCommand {
  keyword: string,
  command: REPLCommand
}