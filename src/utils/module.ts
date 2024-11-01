import { IModuleMountOptions, IModuleRequireProps } from '../typings/types'
import { buildGlobDirs } from './glob'

const requireModule = (path: string): NodeRequire => require(path) || {}

export const modules = {
  load: function (globPattern: string, onError?: IModuleMountOptions['onError']) {
    const dirs = buildGlobDirs(globPattern)

    dirs.forEach((dir) => this.require({ path: dir, onError }))
  },
  require: function (params: IModuleRequireProps) {
    try {
      if (params.removeCache) this.invalidateCache(params.path)
      const modules = requireModule(params.path)
      this.mount(modules)
    } catch (error) {
      params.onError?.(error as Error)
    }
  },
  mount: function (modules: NodeRequire) {
    const repl = global['_repl']

    Object.entries(modules || {}).forEach(([name, module]) => {
      if (repl.useGlobal) global[name] = module
      else repl.context[name] = module
    })
  },
  invalidateCache: function (path: string) {
    delete require.cache[require.resolve(path)]
  }
}
