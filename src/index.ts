import repl from 'repl'
import glob from 'glob'
import { mountModulesToServer, requireModules } from './modules/module-utils'
import { watchForChange } from './modules/watch-utils'
import { IReplServerOptions } from './typings/types'
import { say } from './modules/cli'
import { FSWatcher } from 'chokidar'

export const startReplServer = ({
  replOptions,
  moduleMountOptions,
  watchOptions
}: IReplServerOptions) => {
  const replServer = repl.start(replOptions)

  let watcher: FSWatcher | undefined

  glob(moduleMountOptions.pattern, (error, directories) => {
    if (error) {
      moduleMountOptions.onError?.(error)
    } else {
      say('mounting export files. please wait...')

      directories.forEach((directory) => {
        requireModules({
          path: directory,
          onSuccess: (requiredModules) => {
            mountModulesToServer({ replServer, requiredModules, useGlobal: replOptions?.useGlobal })
          },
          onError: moduleMountOptions.onError
        })
      })

      say('done! repl server ready.')

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
    }
  })

  return {
    replServer,
    watcher
  }
}