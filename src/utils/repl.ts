import { REPLServer } from 'repl'
import { IREPLCommand } from '../typings/types'

export const defineCommands = (commands: IREPLCommand[]) => (server: REPLServer) => {
  commands.forEach(({ keyword, command }) => {
    server.defineCommand(keyword, command)
  })
}