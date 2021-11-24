import { waitUntil } from 'libs'
import { BaseWindow } from 'web-init/src/window'
import type { PlatformGlobal } from '../../../../platform/src/types'
import { readFile, writeFile } from 'fs-extra'
import { dirs } from 'boot'

declare const window: BaseWindow
export const askPlatform = <K = Record<string, any>>(
  f: (
    args: K & {
      global: PlatformGlobal
      readFile: typeof readFile
      writeFile: typeof writeFile
      dirs: typeof dirs
    }
  ) => any,
  args?: K
) => {
  return new Promise(async (resolve) => {
    if (!window.devAskPlatform) {
      window.devAskPlatform = {
        answers: {},
        callbacks: {},
        lastId: 0,
      }
    }

    const ask = window.devAskPlatform
    ask.lastId++
    const id = ask.lastId
    ask.answers[id] = resolve

    if (args) {
      let callbackCount = 0
      for (let [k, v] of Object.entries(args)) {
        if (typeof v === 'function') {
          const callbackId = `__f:${id}|${callbackCount++}`
          ask.callbacks[callbackId] = v
          args[k] = callbackId
        }
      }
    }

    const code = f.toString()
    let script = code

    await waitUntil(
      () => window.ws_dev && window.ws_dev.readyState === window.ws_dev.OPEN
    )
    const ws = window.ws_dev

    global.crypto = window.crypto;
    const serialize = (await import('serialize-javascript')).default
    
    if (ws)
      ws.packAndSend({
        type: 'platform-ask',
        data: script,
        args: serialize(args || undefined),
        id,
      })
  })
}
