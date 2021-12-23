import type { BaseWindow } from '../../web/init/src/window'

export const useWindow = () => {
  let win = null as any
  if (typeof global !== 'undefined' && typeof window === 'undefined') {
    if (global.generateIndexHTML && global.generateIndexHTML.window) {
      win = global.generateIndexHTML.window
    } else if (global.requestContext) {
      win = global.requestContext.get('window')
    }
  } else {
    win = window
  }

  return {
    window: win as unknown as BaseWindow & Window,
    location: win.location as Window['location'],
    document: win.document as Window['document'],
  }
}
