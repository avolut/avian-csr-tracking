import { FastifyReply, FastifyRequest } from 'fastify'
import { SocketStream } from 'fastify-websocket'
import { waitUntil } from 'libs'
import pako from 'pako'
import { PlatformGlobal } from 'platform/src/types'
import serialize from 'serialize-javascript'
import type { _figma } from 'web-dev/src/Figma'
import type { askFigma } from 'web-dev/src/figma/ask-figma'
import { BaseWindow } from 'web-init/src/window'
import { figmaOnMessage } from './figma/dev-figma-route'

declare const global: PlatformGlobal
const connectedClients: SocketStream[] = []

export const devHMRRoute = async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.url === '/__hmr/refresh-all') {
    broadcastHMR({ type: 'hmr-reload-all' })
    reply.send({ status: 'ok' })
  }
}
export const askFigmaBase = <K = Record<string, any>>(
  f: (
    args: K & {
      window: BaseWindow
      figma: typeof _figma
      askFigma: typeof askFigma
    }
  ) => any,
  args?: K
) => {
  return new Promise(async (resolve) => {
    await waitUntil(() => global.figma.connected)

    global.figma.ask.lastId++
    const id = global.figma.ask.lastId
    global.figma.ask.answers[id] = resolve

    if (args) {
      let callbackCount = 0
      for (let [k, v] of Object.entries(args)) {
        if (typeof v === 'function') {
          const callbackId = `__f:${id}|${callbackCount++}`
          global.figma.ask.callbacks[callbackId] = v
          args[k] = callbackId
        }
      }
    }

    const code = f.toString()
    let script = code

    await waitUntil(
      () =>
        global.figma.ws && global.figma.ws.readyState === global.figma.ws.OPEN
    )

    global.figma.ws?.send(
      JSON.stringify({
        type: 'figma-ask',
        data: script,
        args: serialize(args || undefined),
        id,
      })
    )
  })
}

export const devHMRWsRoute = (
  connection: SocketStream & { isFigma: boolean },
  req: FastifyRequest
) => {
  connection.isFigma = false

  global.figma.ws = connection.socket
  connection.socket.on('open', () => {
    console.log('connected')
  })
  connection.socket.on('message', (raw: Buffer) => {
    try {
      const zipped = toArrayBuffer(raw)
      const msg = JSON.parse(pako.inflate(zipped, { to: 'string' }))
      figmaOnMessage(connection, msg)
    } catch (e) {
      console.error(e)
    }
  })

  connection.socket.on('close', () => {
    const idx = connectedClients.indexOf(connection)
    if (idx >= 0) {
      connectedClients.splice(idx)
    }

    if (connection.isFigma) {
      global.figma.connected = false
    }
  })

  connection.socket.on('error', () => {
    const idx = connectedClients.indexOf(connection)
    if (idx >= 0) {
      connectedClients.splice(idx)
    }
  })

  connectedClients.push(connection)
}

export const broadcastHMR = (msg: any) => {
  if (global.dev?.fallbackSaving) return
  for (let c of connectedClients) {
    // 1 === WebSocket.OPEN
    if (c && c.socket && c.socket.readyState === 1) {
      c.socket.send(JSON.stringify(msg))
    }
  }
}
function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length)
  var view = new Uint8Array(ab)
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return view
}
