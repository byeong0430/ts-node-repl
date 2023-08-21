import glob from 'glob'
import { IModuleMountOptions } from '../typings/types'

export const getGlobDirectories = (options: Pick<IModuleMountOptions, 'pattern' | 'onError'>) => {
  let directories: string[] = []
  
  glob(options.pattern, (error, matches) => {
    if (error) {
      options.onError?.(error)
    } else {
      directories = matches
    }
  })

  return directories
}