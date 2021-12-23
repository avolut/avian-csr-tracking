import { useWindow } from 'libs'
import { BaseWindow } from '../../window'

type ValueOf<T> = T[keyof T]
export const loadLayout = async (
  layout: ValueOf<BaseWindow['cms_layouts']>
) => {
  const { window } = useWindow()
  if (layout) {
    let render = window.cms_layouts[layout.id].render
    if (!render) {
      const id = layout.id
      if (layout.id) {
        const injectScript = new Promise<any>((resolve) => {
          const d = document.createElement('script')
          d.src = `/__layout/${id}.js`
          d.id = `layout-${id}`
          d.onload = () => {
            resolve(window.cms_layouts[layout.id].render)
          }
          document.getElementsByTagName('head')[0].appendChild(d)
        })
        layout.render = await injectScript
      }
    }
    return layout
  }
  return false
}
