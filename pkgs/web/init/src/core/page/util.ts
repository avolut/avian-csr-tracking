import { matchRoute } from 'libs'
import { BaseWindow } from '../../window'

export const findPage = (
  url: string,
  cms_pages: Partial<BaseWindow['cms_pages']>,
) => {
  if (!cms_pages) {
    cms_pages = {}
    console.warn(`[BASE] Failed to load page for url: ${url} `)
  }

  for (let [k, v] of Object.entries(cms_pages)) {
    if (k) {
      const params = matchRoute(url, k)

      if (v && params) {
        v.params = params
        return v
      }
    }
  }

  if (!url.startsWith('/__ssr/layout/')) {
    console.warn(
      `[BASE] Page not found: ${url}, Available urls are: \n\n -`,
      Object.keys(cms_pages).join('\n - '),
    )
  }
  return false
}

export const restoreObject = (raw, to) => {
  for (let [k, v] of Object.entries(raw)) {
    if (typeof v !== 'function') {
      if (typeof v === 'object') {
        if (typeof to[k] !== 'object') {
          to[k] = v
        } else {
          restoreObject(v, to[k])
        }
      } else {
        to[k] = v
      }
    }
  }
}