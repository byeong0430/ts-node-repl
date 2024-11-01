import { IReplServerOptions } from './typings/types'

let serverOptions: IReplServerOptions = {
  replOptions: {},
  moduleMountOptions: {},
  watchOptions: {},
} as any

export const setServerOptions = (opts: IReplServerOptions) => {
  serverOptions = opts
}

export const getServerOptions = () => serverOptions