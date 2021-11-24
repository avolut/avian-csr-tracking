import get from 'lodash.get'
import { BaseWindow } from 'web-init/src/window'
import type { defineFigmaWindow } from '../../../../figma/src/plugin/figma-window'
declare const window: BaseWindow

window.figmaAsk = {
  lastId: 0,
  answers: {},
  callbacks: {},
}
export const askFigma = <K = Record<string, any>>(
  f: (
    args: K & {
      window: Record<any, any> & ReturnType<typeof defineFigmaWindow>
    }
  ) => any,
  args?: K
) => {
  return new Promise(async (resolve) => {
    window.figmaAsk.lastId++
    const id = window.figmaAsk.lastId
    window.figmaAsk.answers[id] = resolve

    if (args) {
      let callbackCount = 0
      for (let [k, v] of Object.entries(args)) {
        if (typeof v === 'function') {
          const callbackId = `__f:${id}|${callbackCount++}`
          window.figmaAsk.callbacks[callbackId] = v
          args[k] = callbackId
        }
      }
    }

    const code = f.toString()
    let script = code

    global.crypto = window.crypto;
    const serialize = (await import('serialize-javascript')).default

    parent.postMessage(
      {
        type: 'ask',
        data: script,
        args: serialize(args || undefined),
        id,
      },
      '*'
    )
  })
}

export const connectAskFigma = async () => {
  window.onmessage = (msg) => {
    const pm = get(msg, 'data.pluginMessage')
    if (pm) {
      switch (pm.type) {
        case 'answer':
          {
            let data = undefined
            try {
              if (pm.data) {
                data = JSON.parse(pm.data)
              }
            } catch (e) {}
            window.figmaAsk.answers[pm.id](data)
            delete window.figmaAsk.answers[pm.id]
          }
          break
        case 'ask-callback': {
          if (window.figmaAsk.callbacks[pm.id]) {
            window.figmaAsk.callbacks[pm.id](...pm.args)
          }
        }
      }
    }
  }

  parent.postMessage(
    {
      type: 'figma-ready',
    },
    '*'
  )
}
