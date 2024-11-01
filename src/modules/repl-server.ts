import repl, { ReplOptions } from 'repl'
import { modules } from '../utils/module'
import { watchForChange } from '../utils/watch'
import { IReplServerOptions } from '../typings/types'
import { logger } from '../utils/log'
import { setServerOptions } from '../config'
import { plugCommands } from '../utils/commands'

export const startReplServer = (params: IReplServerOptions) => {
  const { repl, watcher } = boot(params)

  return {
    replServer: repl,
    watcher
  }
}

const boot = (serverOpts: IReplServerOptions) => {
  setServerOptions(serverOpts)

  const r = createRepl(serverOpts.replOptions)
  const watcher = prepareRepl(serverOpts)

  return {
    repl: r,
    watcher,
  }
}

const createRepl = (opts?: ReplOptions) => {
  const r = repl.start(opts)
  global._repl = r
  logger.repl = r

  return r
}

const prepareRepl = (serverOpts: IReplServerOptions) => {
  logger.print('mounting export files. please wait...')
  modules.load(serverOpts.moduleMountOptions.pattern, serverOpts.moduleMountOptions.onError)

  logger.print('done! repl server ready.')
  logger.print('type .help for more information')
  logger.displayPrompt()

  const watcher = watchForChange({ 
    paths: serverOpts.watchOptions.paths || serverOpts.moduleMountOptions.pattern,
    options: serverOpts.watchOptions.options
  })

  plugCommands(global._repl, watcher)

  return watcher
}