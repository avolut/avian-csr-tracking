import trim from 'lodash.trim'
import { removeCircular } from 'web-utils/src/removeCircular'
import { defineFigmaWindow } from './figma-window'

const window = defineFigmaWindow()
const askCallbacks = {}

figma.showUI(__html__, {
  visible: false,
})
figma.ui.show()
figma.ui.resize(400, 230)
figma.ui.onmessage = async (msg: {
  type: string
  data: Record<string, any> | string
  args?: any
  id?: any
}) => {
  switch (msg.type) {
    case 'ask':
      {
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

          args.compiled.window = window

          let call = new Function(`
const u = (f) =>f;
return (${script})(this.args);
`).bind({
            args: args.compiled,
          })

          let result = null
          try {
            result = call()
          } catch (e) {
            if (e.message.indexOf(' is not defined') > 0) {
              const vard = trim(e.message.split(' ').shift(), "'")
              call = new Function(`
const ${vard} = (f) =>f;
return (${script})(this.args);
              `).bind({
                args: args.compiled,
              })
              try {
                result = call()
              } catch (e) {
                console.error(`\
[FigmaBase] askFigma() failed:
Error: ${e.message}

Source Code:
${script}
              `)
              }
            } else {
              console.error(`\
[FigmaBase] askFigma() failed:
Error: ${e.message} 

Source Code: 
${script}
`)
            }
          }

          const finalResult = result instanceof Promise ? await result : result
          let data = JSON.stringify(finalResult, removeCircular())
          figma.ui.postMessage({
            type: 'answer',
            data,
            id: msg.id,
          })
        }
      }
      break
    case 'get-root-data':
      if (typeof msg.data === 'object') {
        figma.ui.postMessage({
          type: 'get-root-data',
          data: figma.root.getPluginData(msg.data.name) || msg.data.default,
        })
      }
      break
  }
}

const defineAskCallback = (callbackId: string) => {
  return (...args: any[]) => {
    figma.ui.postMessage({
      type: 'ask-callback',
      id: callbackId,
      args,
    })
  }
}
