import { dirs, log } from 'boot'
import { createHash } from 'crypto'
import { SocketStream } from 'fastify-websocket'
import { readFile, writeFile } from 'fs-extra'
import { PlatformGlobal } from 'platform/src/types'
import { removeCircular } from 'web-utils/src/removeCircular'

declare const global: PlatformGlobal

export const prepareFigma = () => {
  if (!global.figma) {
    global.figma = {
      connected: false,
      saving: {},
      ask: {
        lastId: 0,
        callbacks: {},
        answers: {},
      },
      nextId: 1000,
    }
  }
  return global.figma
}

const askCallbacks = {}

export const figmaOnMessage = async (
  connection: SocketStream & { isFigma: boolean },
  msg: {
    type: string
    data: string | object
    id?: string
    args?: any
  }
) => {
  switch (msg.type) {
    case 'figma-save-frame':
      {
        if (typeof msg.data === 'object') {
          const data: { id: string; code: string; nodes: string } =
            msg.data as any
          if (data) {
            const page = global.cache.page[data.id]
            if (page) {
              global.figma.saving[page.id] = {
                jsx: data.code,
                nodes: data.nodes,
              }

              // const hash = md5(data.code)
              // const jsx = await compileSinglePage(page.id, data.code)
              // if (jsx) {
              //   page.jsx = jsx
              //   pageStorage.set(`page-${page.id}-code`, page.jsx.code)
              //   pageStorage.set(`page-${page.id}-map`, page.jsx.map)
              //   pageStorage.set(`page-${page.id}-hash`, hash)

              //   const isChanged = await global.dev.history.pushChange(
              //     'page',
              //     data.id,
              //     data.code,
              //     JSON.stringify(data.nodes)
              //   )
              //   if (isChanged) {
              //     await writeFile(
              //       join(dirs.app.web, 'src', 'base', 'page', `${page.id}.jsx`),
              //       data.code
              //     )
              //   }
              // }
            }
            const layout = global.cache.layout[data.id]
            if (layout) {
              global.figma.saving[layout.id] = {
                jsx: data.code,
                nodes: data.nodes,
              }

              // const hash = md5(data.code)
              // const jsx = await compileSinglePage(layout.id, data.code)
              // if (jsx) {
              //   layout.jsx = jsx
              //   pageStorage.set(`page-${layout.id}-code`, layout.jsx.code)
              //   pageStorage.set(`page-${layout.id}-map`, layout.jsx.map)
              //   pageStorage.set(`page-${layout.id}-hash`, hash)

              //   const isChanged = await global.dev.history.pushChange(
              //     'layout',
              //     data.id,
              //     data.code,
              //     JSON.stringify(data.nodes)
              //   )
              //   if (isChanged) {
              //     await writeFile(
              //       join(
              //         dirs.app.web,
              //         'src',
              //         'base',
              //         'layout',
              //         `${layout.id}.jsx`
              //       ),
              //       data.code
              //     )
              //   }
              // }
            }
          }
        }
      }
      break
    case 'figma-ready':
      {
        connection.isFigma = true
        if (!global.figma) {
          prepareFigma()
        }
        global.figma.connected = true
        log('figma', 'Figma Plugin Connected ')

        // setTimeout(async () => {
        //   let figmaOutput = await askFigmaBase((x) => {
        //     const frame = x.figma.cache.framesByTargetId['80379']
        //     return frame.target

        //   })
        //   console.log(figmaOutput)
        // }, 1000)
      }
      break
    case 'platform-ask':
      {
        if (typeof msg.data === 'string') {
          const script = `${msg.data}`

          let args = { compiled: {} as any }
          if (msg.args !== 'undefined') {
            new Function(`this.args.compiled = ${msg.args}`).bind({
              args,
            })()
            for (let [k, v] of Object.entries(args.compiled)) {
              if (typeof v === 'string' && v.startsWith('__f:')) {
                askCallbacks[v] = defineAskCallback(v, connection)
                args.compiled[k] = askCallbacks[v]
              }
            }
          }

          args.compiled.global = global
          args.compiled.readFile = readFile
          args.compiled.writeFile = writeFile
          args.compiled.dirs = dirs
          const call = new Function(`return (${script})(this.args)`).bind({
            args: args.compiled,
          })
          try {
            const result = call()
            const finalResult =
              result instanceof Promise ? await result : result
            let data = JSON.stringify(finalResult, removeCircular())
            connection.socket.send(
              JSON.stringify({
                type: 'platform-answer',
                id: msg.id,
                data,
              })
            )
          } catch (e: any) {
            console.error(`\
[platform] askPlatform() failed:
Error: ${e.message}

Source Code: 
${script}
`)
          }
        }
      }
      break
    case 'figma-ask-callback':
      {
        if (global.figma.ask.callbacks[msg.id || '']) {
          global.figma.ask.callbacks[msg.id || ''](...msg.args)
        }
      }
      break
    case 'figma-answer':
      {
        let data = undefined
        try {
          if (typeof msg.data === 'string') {
            data = JSON.parse(msg.data)
          }
        } catch (e) {}
        global.figma.ask.answers[msg.id || ''](data)
        delete global.figma.ask.answers[msg.id || '']
      }
      break
  }
}

const md5 = (text: string) => {
  return createHash('md5').update(text).digest('hex')
}

const defineAskCallback = (
  callbackId: string,
  connection: SocketStream & { isFigma: boolean }
) => {
  return (...args: any[]) => {
    connection.socket.send(
      JSON.stringify({
        type: 'figma-ask-callback',
        id: callbackId,
        args,
      })
    )
  }
}
