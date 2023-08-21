import repl from 'repl'
import { setModules } from './module-utils'
import { watchForChange } from './watch-utils'
import { IReplServerOptions } from '../typings/types'
import { FSWatcher } from 'chokidar'
import { getGlobDirectories } from './glob-utils'
import { defineCommands } from './repl-utils'

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

  defineCommands([
    {
      keyword: 'reset',
      command: {
        help: 'Reset loaded modules',
        action: reloadModules
      }
    }
  ])(replServer)

  const watchPaths = watchOptions.paths || moduleMountOptions.pattern

  watcher = watchForChange({ 
    replServer,
    watchOptions: {
      paths: watchPaths,
      options: watchOptions.options
    },
    replUseGlobal: replOptions?.useGlobal
  })

  replServer.addListener('exit', () => {
    watcher?.close()
  })

  return {
    replServer,
    watcher
  }
}