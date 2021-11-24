import { BaseWindow } from '../../init/src/window'

declare const window: BaseWindow
export const injectCSS = (href: string) => {
  return new Promise((resolve) => {
    const ex = document.querySelector(`link[href^="${href}"]`)
    if (ex) ex.remove()

    var head_node = document.getElementsByTagName('head')[0]
    var link_tag = document.createElement('link')
    link_tag.setAttribute('rel', 'stylesheet')
    link_tag.setAttribute('type', 'text/css')
    link_tag.setAttribute(
      'href',
      `${href}${window.is_dev ? '?' + new Date().getTime() : ''}`
    )
    head_node.appendChild(link_tag)
    link_tag.onload = resolve
  })
}
