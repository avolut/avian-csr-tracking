import { matchRoute, waitUntil } from 'libs'
import { BaseWindow } from '../window'
import { generatePage } from './gen-page'
declare const window: BaseWindow

export const findPage = (url: string) => {
  if (!window.cms_pages) {
    window.cms_pages = {}
    console.warn(`[BASE] Failed to load page for url: ${url} `)
  }

  for (let [k, v] of Object.entries(window.cms_pages)) {
    if (k) {
      const params = matchRoute(url, k)

      if (params) {
        v.params = params;
        return v
      }
    }
  }

  console.warn(
    `[BASE] Page not found: ${url}, Available urls are: \n\n -`,
    Object.keys(window.cms_pages).join('\n - ')
  )
  return false
}

export const loadPageRenderer = async (found: ReturnType<typeof findPage>) => {
  if (!window.cms_base_pack) {
    await waitUntil(() => window.cms_base_pack)
  }
  if (found) {
    let render = window.cms_pages[found.url].render
    if (!render) {
      const id = found.id
      if (found.id) {
        const injectScript = new Promise<any>((resolve) => {
          const d = document.createElement('script')
          d.src = `/__page/${id}.js`
          d.id = `page-${id}`
          d.onload = () => {
            resolve(window.cms_pages[found.url].render)
          }
          document.getElementsByTagName('head')[0].appendChild(d)
        })
        found.render = await injectScript
      }
    }
    return found
  }
  return false
}

type ValueOf<T> = T[keyof T]
export const loadLayout = async (
  layout: ValueOf<BaseWindow['cms_layouts']>
) => {
  if (!window.cms_base_pack) {
    await waitUntil(() => window.cms_base_pack)
  }
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
