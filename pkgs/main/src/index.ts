import { expose } from 'builder'
import { MainGlobal, start, stop } from './start'

declare const global: MainGlobal
expose({
  start: async (parent, args) => {
    global.mode = args.mode
    global.parent = parent
    global.rootstamp = args.rootstamp
    start(args.port, args.mode, parent)
  },
  onMessage: async (msg) => {
    if (msg === 'exit') {
      stop()
    }
  },
})
