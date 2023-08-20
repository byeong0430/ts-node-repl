import repl from 'repl'
import glob from 'glob'
import * as chokidar from 'chokidar'
import fs from 'fs'

const targetDir = __dirname
const mountDirGlob = `${targetDir}/!(test*|graphql)/**/**/!(*.d|*.test).ts`

// inspiration from https://sapandiwakar.in/rails-like-console-for-node-js-and-node-ts-2/
const replServer = repl.start({
  prompt: 'app > ',
  useColors: true
})

const watcher = chokidar.watch(mountDirGlob, {
  ignoreInitial: true // We don't want resynth to take place for every single initial file change
})

replServer.addListener('exit', () => {
  watcher.close()
})

const requireFile = ({ 
  path, 
  removeCache = false, 
  callback 
}: { 
  path: string
  removeCache?: boolean
  callback: (exportVars: Record<string, unknown>) => void 
}) => {
  try {
    if (removeCache) {
      /**
       * "require" caches already required files. Remove cache to get up-to-update file content
       * reference: https://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
       */
      delete require.cache[require.resolve(path)]
    }

    const exportVars = require(path)

    callback(exportVars || {})
  } catch (error) {
    console.error(error)
  }
}

const watchForChange = () => {
  console.log('watching for file changes...')

  watcher.on('all', async (_, path) => {
    const fileExists = fs.existsSync(path)

    let exportVars = {}

    requireFile({
      path, 
      removeCache: fileExists,
      callback: (freshExportVars) => {
        exportVars = freshExportVars
      }
    })

    Object.entries(exportVars).forEach(([key, value]) => {
      if (fileExists) {
        replServer.context[key] = value
      } else {
        delete replServer.context[key]
      }
    })
  })
}

/**
 * Excluded files / folders:
 * - files in test folders
 * - type files (d.ts)
 */

glob(mountDirGlob, (err: any, directories: string[]) => {
  if (err) {
    throw new Error(err)
  } else {
    console.log('mounting export files. please wait...')

    directories.forEach((dir) => {
      requireFile({
        path: dir, 
        callback: (exportVars) => {
          Object.keys(exportVars).forEach((exportVarName) => {
            replServer.context[exportVarName] = exportVars[exportVarName]
          })
        }
      })
    })

    console.log('done!')

    watchForChange()
  }
})

// replServer.context.mockEvent = mockEvent