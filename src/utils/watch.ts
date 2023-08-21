import * as chokidar from 'chokidar'
import fs from 'fs'
import { mountModulesToServer, requireModules } from './module'
import { IWatchOptions } from '../typings/types'
import { REPLServer } from 'repl'
import { say } from '../modules/cli'

export const startWatcher = (watchOptions: IWatchOptions) => {
  const watcher = chokidar.watch(watchOptions.paths, {
    ...watchOptions.options,
    ignoreInitial: true // We don't want resynth to take place for every single initial file change
  })

  return watcher
}

export const watchForChange = ({ 
  watchOptions,
  replServer,
  replUseGlobal
}: { 
  watchOptions: IWatchOptions
  replServer: REPLServer
  replUseGlobal?: boolean
}) => {
  const watcher = startWatcher(watchOptions)

  say('watching for file changes...')
  watcher.on('all', async (_, path) => {
    const moduleExists = fs.existsSync(path)

    requireModules({
      path, 
      removeCache: moduleExists,
      onSuccess: (requiredModules) => {
        mountModulesToServer({ replServer, requiredModules, useGlobal: replUseGlobal })
      }
    })
  })

  replServer.displayPrompt()

  return watcher
}