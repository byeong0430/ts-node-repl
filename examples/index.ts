import { startReplServer } from '../src'

const targetDir = __dirname
const mountDirGlob = `${targetDir}/!(test*|graphql)/**/**/!(*.d|*.test).ts`

startReplServer({
  replOptions: {
    prompt: 'app > ',
    useColors: true
  },
  moduleMountOptions: {
    pattern: mountDirGlob,
    onError: (error) => {
      throw error
    }
  },
  watchOptions: {
    paths: mountDirGlob,
    options: {
      ignoreInitial: true
    }
  }
})
