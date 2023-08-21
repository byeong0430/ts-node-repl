import repl from 'repl'
import { setModules } from '../utils/module'
import { watchForChange } from '../utils/watch'
import { IReplServerOptions } from '../typings/types'
import { FSWatcher } from 'chokidar'
import { getGlobDirectories } from '../utils/glob'
import { defineCommands } from '../utils/repl'

export const startReplServer = ({
  replOptions,
  moduleMountOptions,
  watchOptions
}: IReplServerOptions) => {
  const replServer = repl.start(replOptions)

  let watcher: FSWatcher | undefined
 
  const directories = getGlobDirectories(moduleMountOptions)

  const reloadModules = () => setModules({
    directories,
    useGlobal: replOptions?.useGlobal,
    onError: moduleMountOptions.onError
  })(replServer)

  reloadModules()

  const watchPaths = watchOptions.paths || moduleMountOptions.pattern

  watcher = watchForChange({ 
    replServer,
    watchOptions: {
      paths: watchPaths,
      options: watchOptions.options
    },
    replUseGlobal: replOptions?.useGlobal
  })

  defineCommands([
    {
      keyword: 'reset',
      command: {
        help: 'Reset loaded modules',
        action: reloadModules
      }
    },
    {
      keyword: 'exit',
      command: {
        help: 'Exit the REPL',
        action: () => {
          replServer.close()
          watcher?.close()
          process.exit()
        }
      }
    }
  ])(replServer)

  return {
    replServer,
    watcher
  }
}