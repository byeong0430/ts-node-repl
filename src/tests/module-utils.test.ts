import * as moduleUtils from '../modules/module-utils'
import repl from 'repl'

describe('module-utils', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should invalidate cache when removeCache is set to true', () => {
    const mockedInvalidatedCache = jest.spyOn(moduleUtils, 'invalidateCache').mockImplementation(() => {})
  
    moduleUtils.requireModules({ 
      path: 'glob',
      removeCache: true,
      onSuccess: jest.fn(),
      onError: jest.fn() 
    })
  
    expect(mockedInvalidatedCache).toHaveBeenCalledWith('glob')
  })
  
  test('should return requiredModules', () => {
    jest.spyOn(moduleUtils, 'invalidateCache').mockImplementation(() => {})
  
    let modules: NodeRequire | undefined
  
    const mockedOnError = jest.fn()
  
    moduleUtils.requireModules({ 
      path: 'glob',
      removeCache: true,
      onSuccess: (requiredModules) => {
        modules = requiredModules
      },
      onError: mockedOnError
    })
  
    expect(modules).toBeDefined()
    expect(mockedOnError).not.toHaveBeenCalled()
  })
  
  test('should not return requiredModules if errored', () => {
    jest.spyOn(moduleUtils, 'invalidateCache').mockImplementation(() => {
      throw new Error('error occurred')
    })
  
    let modules: NodeRequire | undefined
  
    const mockedOnError = jest.fn()
  
    moduleUtils.requireModules({ 
      path: 'glob',
      removeCache: true,
      onSuccess: (requiredModules) => {
        modules = requiredModules
      },
      onError: mockedOnError
    })
  
    expect(modules).toBeUndefined()
    expect(mockedOnError).toHaveBeenCalled()
  })
  
  test(`should mount modules to repl server's global if useGlobal is set to true`, () => {
    const server = repl.start()
  
    moduleUtils.mountModulesToServer({ 
      replServer: server,
      requiredModules: require('glob'),
      useGlobal: true
    }) 
    
    expect(global['glob']).toBeDefined()
    expect(server.context['glob']).toBeUndefined()
  
    server.close()
    delete global['glob']
  })
  
  test(`should mount modules to repl server's context if useGlobal is set to false`, () => {
    const server = repl.start()
  
    moduleUtils.mountModulesToServer({ 
      replServer: server,
      requiredModules: require('glob'),
      useGlobal: false
    }) 
    
    expect(global['glob']).toBeUndefined()
    expect(server.context['glob']).toBeDefined()
  
    server.close()
  })
})
