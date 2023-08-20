import repl from 'repl'
import glob from 'glob'
import { mountModulesToServer, requireModules } from './modules/module-utils'
import { watchForChange } from './modules/watch-utils'
import { IReplServerOptions } from './typings/types'

export const startReplServer = ({
  replOptions,
  moduleMountOptions,
  watchOptions
}: IReplServerOptions) => {
  const replServer = repl.start(replOptions)

  if (!moduleMountOptions) {
    return 
  }

  glob(moduleMountOptions.pattern, (error, directories) => {
    if (error) {
      moduleMountOptions.onError?.(error)
    } else {
      directories.forEach((directory) => {
        requireModules({
          path: directory,
          onSuccess: (requiredModules) => {
            mountModulesToServer({ replServer, requiredModules, useGlobal: replOptions?.useGlobal })
          },
          onError: moduleMountOptions.onError
        })
      })

      const watchPaths = watchOptions.paths || moduleMountOptions.pattern

      watchForChange({ 
        replServer,
        watchOptions: {
          paths: watchPaths,
          options: watchOptions.options
        },
        replUseGlobal: replOptions?.useGlobal
      })
    }
  })
}