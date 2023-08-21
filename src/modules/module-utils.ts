import { IModuleMountOptions, IModuleMountProps, IModuleRequireProps } from '../typings/types'
import { REPLServer } from 'repl'
import { say } from './cli'

export const invalidateCache = (path: string) => {
  delete require.cache[require.resolve(path)]
}

export const requireModules = ({ 
  path, 
  removeCache = false, 
  onSuccess,
  onError
}: IModuleRequireProps) => {
  try {
    if (removeCache) {
      invalidateCache(path)
    }

    const requireModules: NodeRequire = require(path) || {}

    onSuccess(requireModules)
  } catch (error) {
    onError?.(error as Error)
  }
}

export const mountModulesToServer = ({ 
  replServer,
  requiredModules,
  useGlobal 
}: IModuleMountProps) => {
  Object.entries(requiredModules).forEach(([name, module]) => {
    if (useGlobal) {
      global[name] = module
    } else {
      replServer.context[name] = module
    }
  })
}

export const setModules = ({
  directories,
  useGlobal,
  onError
}: {
  directories: string[]
  useGlobal?: boolean,
  onError?: IModuleMountOptions['onError']
}) => (replServer: REPLServer) => {
  say('mounting export files. please wait...')

  directories.forEach((directory) => {
    requireModules({
      path: directory,
      onSuccess: (requiredModules) => {
        mountModulesToServer({ replServer, requiredModules, useGlobal })
      },
      onError
    })
  })

  say('done! repl server ready.')
  say('type .help for more information')

  replServer.displayPrompt()
}