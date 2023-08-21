import { IModuleMountProps, IModuleRequireProps } from '../typings/types'

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