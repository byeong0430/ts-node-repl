import { REPLServer } from 'repl'
import { modules } from './module'
import { getServerOptions } from '../config'
import { FSWatcher } from 'chokidar'
import { logger } from './log'

export const plugCommands = (repl: REPLServer, watcher: FSWatcher) => {
  const serverOptions = getServerOptions()

  repl.defineCommand('reset', {
    help: 'Reset loaded modules',
    action: () => {
      modules.load(serverOptions.moduleMountOptions.pattern, serverOptions.moduleMountOptions.onError)
      logger.displayPrompt()
    }
  })

  repl.defineCommand('exit', {
    help: 'Exit the REPL',
    action: () => {
      repl.close()
      watcher?.close()
      process.exit()
    }
  })
}