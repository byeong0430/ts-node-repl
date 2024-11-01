import * as chokidar from 'chokidar'
import fs from 'fs'
import { modules } from './module'
import { IWatchOptions } from '../typings/types'
import { logger } from './log'

export const startWatcher = (opts: IWatchOptions) => {
  return chokidar.watch(opts.paths, {
    ...opts.options,
    persistent: true,
    ignoreInitial: true // We don't want resynth to take place for every single initial file change
  })
}

export const watchForChange = (opts: IWatchOptions) => {
  const watcher = startWatcher(opts)
  logger.print('watching for file changes...')

  watcher.on('all', async (_, path) => {
    const moduleExists = fs.existsSync(path)

    modules.require({
      path, 
      removeCache: moduleExists,
    })
  })

  logger.displayPrompt()

  return watcher
}