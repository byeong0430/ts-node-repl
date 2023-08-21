import { REPLServer } from 'repl'
import { startReplServer } from '..'
import { FSWatcher } from 'chokidar'

jest.mock('glob', () => {
  return jest.fn((pattern, callback) => {
    callback(null, [])
  })
})

describe('repl-server', () => {
  test('should return created repl server', () => {
    const { replServer } = startReplServer({
      replOptions: {
        prompt: 'app > ',
        useColors: true
      },
      moduleMountOptions: {
        pattern: './',
        onError: (error) => {
          throw error
        }
      },
      watchOptions: {
        paths: './',
        options: {
          ignoreInitial: true
        }
      }
    })
  
    expect(replServer).toBeDefined()
    expect(replServer).toBeInstanceOf(REPLServer)
    
    replServer.close()
  })
  
  test('should return created watcher', () => {
    const { replServer, watcher } = startReplServer({
      replOptions: {
        prompt: 'app > ',
        useColors: true
      },
      moduleMountOptions: {
        pattern: './',
        onError: (error) => {
          throw error
        }
      },
      watchOptions: {
        paths: './',
        options: {
          ignoreInitial: true
        }
      }
    })
  
    expect(watcher).toBeDefined()
    expect(watcher).toBeInstanceOf(FSWatcher)
    
    replServer.close()
  })
})
