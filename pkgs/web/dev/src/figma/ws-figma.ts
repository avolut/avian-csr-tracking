import { waitUntil } from 'libs'
import { _figma } from 'web-dev/src/Figma'
import { BaseWindow } from 'web-init/src/window'
import { removeCircular } from 'web-utils/src/removeCircular'
import { askFigma } from './ask-figma'

declare const window: BaseWindow

const askCallbacks = {}

export const connectWSFigma = async () => {
  await waitUntil(
    () => window.ws_dev && window.ws_dev.readyState === window.ws_dev.OPEN
  )
  const wsdev = window.ws_dev
  if (wsdev) {
    wsdev.packAndSend({
      type: 'figma-ready',
    })
    wsdev.onConnected = (ws) => {
      // console.clear()
      _figma.main.connected = true
      if (ws)
        ws.packAndSend({
          type: 'figma-ready',
        })
      _figma.main.relayout()
    }
    wsdev.onDisconnected = () => {
      _figma.main.connected = false
      _figma.main.render()
    }
    wsdev.onReceive = async (receive, ws) => {
      let raw = JSON.parse(receive.data)
      if (raw.type === 'figma-ask') {
        const msg: { type: string; data: string; args: string; id: number } =
          raw

        if (typeof msg.data === 'string') {
          const script = `${msg.data}`

          let args = { compiled: {} as any }
          if (msg.args !== 'undefined') {
            new Function(`this.args.compiled = ${msg.args}`).bind({ args })()
            for (let [k, v] of Object.entries(args.compiled)) {
              if (typeof v === 'string' && v.startsWith('__f:')) {
                askCallbacks[v] = defineAskCallback(v)
                args.compiled[k] = askCallbacks[v]
              }
            }
          }

          args.compiled.figma = _figma
          args.compiled.askFigma = askFigma
          args.compiled.window = window
          const call = new Function(`return (${script})(this.args)`).bind({
            args: args.compiled,
          })
          try {
            const result = call()
            const finalResult =
              result instanceof Promise ? await result : result
            let data = JSON.stringify(finalResult, removeCircular())
            window.ws_dev?.packAndSend({
              type: 'figma-answer',
              id: msg.id,
              data,
            })
          } catch (e: any) {
            console.error(`\
[FigmaBase] askFigmaBase() failed:
Error: ${e.message}

Source Code: 
${script}
`)
          }
        }
      }
    }

    _figma.main.connected = true
  }
}

const defineAskCallback = (callbackId: string) => {
  return (...args: any[]) => {
    console.log('sending ws_dev')
    window.ws_dev?.packAndSend({
      type: 'figma-ask-callback',
      id: callbackId,
      args,
    })
  }
}
