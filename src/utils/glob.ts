import glob from 'glob'

export const getGlobDirectories = (pattern: string) => {
  const directories = glob.sync(pattern)
  
  return directories
}