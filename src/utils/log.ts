import { format } from 'util'
import { REPLServer } from 'repl'
import * as colors from 'ansicolors'

export const logger = {
  repl: undefined as REPLServer | undefined,
  output: process.stdout,

  info: function (args: string | IArguments) {
    this.output.write(colors.brightBlack('INFO ') + colors.brightBlack(format.apply(this, typeof args === 'string' ? [args] : args) + '\n'))
  },
  warn: function (args: IArguments) {
    this.output.write(colors.blue('WARN ') + format.apply(this, args) + '\n')
  },
  error: function (args: IArguments) {
    this.output.write(colors.red('ERR! ') + format.apply(this, args) + '\n')
  },
  print: function (args: IArguments) {
    this.output.write(colors.brightBlack(format.apply(this, args)) + '\n')
  },
  displayPrompt: function () {
    global['_repl']?.displayPrompt()
  }
}
