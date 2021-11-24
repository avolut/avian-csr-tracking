import { _figma } from 'web-dev/src/Figma'
import { initFluent } from 'web-init/src/web/initFluent'
import { BaseWindow } from 'web-init/src/window'
import { loadExt } from 'web-utils/src/loadExt'
import { connectAskFigma } from './ask-figma'
import { FigmaBase } from './figma-base'
import { connectWSFigma } from './ws-figma'

declare const window: BaseWindow

export const init = async () => {
  window.Buffer = await loadExt(`dev/buffer.js`)
  window.babel.generate = (
    (await import('@babel/generator')).default as any
  ).default
  window.babel.traverse = (
    (await import('@babel/traverse')).default as any
  ).default
  window.babel.parse = ((await import('@babel/parser')).default as any).parse

  connectAskFigma()
  FigmaBase.init()

  await connectWSFigma()
  await initFluent()
  _figma.main.render()
  setTimeout(() => {
    _figma.main.init = true
    _figma.main.render()
  }, 1000)
}
