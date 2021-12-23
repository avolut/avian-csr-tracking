import { expose } from '../../builder/src/thread'
import { parentPort } from 'worker_threads'
import { initEnv } from './env/env-init'
import { startServer } from './server'
import { PlatformGlobal } from './types'

declare const global: PlatformGlobal

// when invoked by builder pool. it is dev
if (parentPort) {
  expose({
    start: async (parent, args) => {
      await initEnv(args.mode, parent)
      if (global.pool) {
        if (args.mode === 'dev') {
          if (global.pool.shouldExit) {
            return
          }
        }
      }
      startServer()
    },
    onMessage: async (raw: any) => {
      if (global.pool) {
        global.pool.onMessage(raw)
      }
    },
  })
}

// when invoked stand alone. it is prod
else {
  if (!global.build) global.build = {} as any
  global.build.tstamp = new Date().getTime()

  initEnv('prod').then(async () => {
    await startServer()
  })
}
