import { BaseWindow } from '../../init/src/window'

declare const window: BaseWindow
export const injectCSS = (href: string) => {
  return new Promise((resolve) => {
    const ex = document.querySelector(`link[href^="${href}"]`)
    if (ex) ex.remove()

    var title_node = document.querySelector('head > title')
    var link_tag = document.createElement('link')
    link_tag.setAttribute('rel', 'stylesheet')
    link_tag.setAttribute('type', 'text/css')
    link_tag.setAttribute(
      'href',
      `${href}${window.is_dev ? '?' + new Date().getTime() : ''}`
    )
    if (title_node && title_node.parentNode)
      title_node.parentNode.insertBefore(link_tag, title_node.nextSibling)
      
    link_tag.onload = resolve
  })
}
