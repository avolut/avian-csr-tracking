import { dirs } from 'boot'
import { pathExists, remove } from 'fs-extra'
import { join } from 'path'

export const genTypes = async () => {
  const typePath = join(dirs.app.web, 'external.d.ts')
  if (await pathExists(typePath)) {
    await remove(typePath)
  }

  

  const source = `\
export {}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            effect: any
        }
    }
    namespace React {
        interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
            class: string
        }
    }
}
  `
}
