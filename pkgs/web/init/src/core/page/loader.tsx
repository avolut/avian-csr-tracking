import { useWindow } from 'libs'
import { BaseWindow } from '../../window'

type ValueOf<T> = T[keyof T]
export const loadPage = async (page: ValueOf<BaseWindow['cms_pages']>) => {
  const { window } = useWindow()
  if (page) {
    if (!window.cms_pages[page.id]) {
      window.cms_pages[page.id] = page
    }
    const render = window.cms_pages[page.id].render

    if (!render) {
      window.cms_pages[page.id].render = (() => {}) as any
      const id = page.id

      if (page.id) {
        const injectScript = new Promise<any>((resolve) => {
          const d = document.createElement('script')

          if (!window.is_dev && window.hostname) {
            d.src = `${window.hostname}/__page/${id}.js`
          } else {
            d.src = `/__page/${id}.js`
          }

          d.id = `page-${id}`
          d.onload = () => {
            resolve(window.cms_pages[page.id].render)
          }
          document.getElementsByTagName('head')[0].appendChild(d)
        })
        page.render = await injectScript
      }
    }
    return page
  }
  return false
}
