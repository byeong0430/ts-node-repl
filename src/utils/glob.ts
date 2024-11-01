import glob from 'glob'

export const buildGlobDirs = (pattern: string) => {
  return glob.sync(pattern)
}