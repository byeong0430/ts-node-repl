import repl from 'repl'
import { setModules } from '../utils/module'
import { watchForChange } from '../utils/watch'
import { IReplServerOptions } from '../typings/types'
import { getGlobDirectories } from '../utils/glob'
import { defineCommands } from '../utils/repl'

export const startReplServer = ({
  verbose = false,
  replOptions,
  moduleMountOptions,
  watchOptions
}: IReplServerOptions) => {
  const replServer = repl.start(replOptions)

  const directories = getGlobDirectories(moduleMountOptions.pattern)

  const reloadModules = () => {
    setModules({
      verbose,
      directories,
      useGlobal: replOptions?.useGlobal,
      onError: moduleMountOptions.onError
    })(replServer)
  }

  reloadModules()

  const watchPaths = watchOptions.paths || moduleMountOptions.pattern

  const watcher = watchForChange({ 
    replServer,
    verbose,
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