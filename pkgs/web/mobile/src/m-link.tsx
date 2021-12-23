/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Link } from 'framework7-react'
import { waitUntil } from 'libs'
import { BaseWindow } from 'web/init/src/window'

declare const window: BaseWindow

export default (props) => {
  const nprops = { ...props }

  if (nprops) {
    if (nprops.back) {
      const back = nprops.back
      nprops.onClick = (e) => {
        window.back(back)

        if (props.onClick) {
          props.onClick(e)
        }
      }
      delete nprops.back
    }
    if (nprops.href) {
      const href = nprops.href
      nprops.onClick = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (nprops.panelClose) {
          await waitUntil(() => {
            const html = document.querySelector('html')
            if (
              html?.classList.contains('with-panel') ||
              html?.classList.contains('with-panel-closing')
            )
              return false
            return true
          })
        }
        window.navigate(href)

        if (props.onClick) {
          props.onClick(e)
        }
      }
      delete nprops.href
    }
  }

  return (
    <Link
      {...nprops}
      onClick={(e) => {
        if (nprops) {
          if (nprops.onClick) nprops.onClick(e)
        }
      }}
    />
  )
}
