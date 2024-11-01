import { format } from 'util'
import { REPLServer } from 'repl'
import * as colors from 'ansicolors'

const applyFormat = (args: string | IArguments) => {
  return format.apply(this, typeof args === 'string' ? [args] : args)
}

export const logger = {
  repl: undefined as REPLServer | undefined,
  output: process.stdout,

  info: function (args: string | IArguments) {
    this.output.write(colors.brightBlack('INFO ') + colors.brightBlack(applyFormat(args) + '\n'))
  },
  warn: function (args: string | IArguments) {
    this.output.write(colors.blue('WARN ') + applyFormat(args) + '\n')
  },
  error: function (args: string | IArguments) {
    this.output.write(colors.red('ERR! ') + applyFormat(args) + '\n')
  },
  print: function (args: string | IArguments) {
    this.output.write(colors.brightBlack(applyFormat(args)) + '\n')
  },
  printProcess: function(args: string | IArguments) {
    this.output.clearLine(0);
    this.output.cursorTo(0);
    this.output.write(colors.brightBlack(applyFormat(args)));

    return {
      done: () => {
        this.output.write('\n')
      }
    }
  },
  displayPrompt: function () {
    global['_repl']?.displayPrompt()
  }
}
