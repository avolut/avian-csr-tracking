/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { waitUntil } from 'libs'
import { memo, useEffect, useRef } from 'react'
import { useRender } from 'web-utils/src/useRender'
import { findPage } from '../core/load-page'
import { renderCore } from '../core/render'
import { DevBar } from '../devbar/DevBar'
import { BaseWindow } from '../window'
declare const window: BaseWindow

export const WebMain = () => {
  const _ = useRef({
    url: location.pathname,
    current: 'page' as 'page' | 'next',
    page: {
      ref: null as any,
      comp: null as any,
    },
    next: { ref: null as any, comp: null as any },
  })
  const meta = _.current
  const render = useRender()

  window.webApp = {
    render: (url: string, init = false) => {
      meta.url = url
      const page = findPage(url)
      if (page) {
        if (!page.component) {
          page.component = () => {
            return renderCore({ NotFound: PageNotFound, init })
          }
        }

        meta.page.comp = page.component
        if (meta.page.comp && !meta.page.comp.displayName) {
          Object.defineProperty(meta.page.comp, 'displayName', { value: url })
        } 
        render()
      }
    },
  }

  if (!meta.page.comp) {
    window.webApp.render(meta.url, true)
    return null
  }
  const Page = meta.page.comp

  const rootCSS = css`
    > div {
      flex: 1;
    }
  `

  return (
    <>
      {Page && (
        <div
          ref={(e) => (meta.page.ref = e)}
          className={`web ${
            meta.current === 'page' ? 'flex' : 'hidden'
          } flex-1 items-stretch`}
          css={rootCSS}
        >
          <Page />
        </div>
      )}
      {window.is_dev && <DevBar />}
    </>
  )
}

const PageNotFound = () => {
  return <div>Page Not Found</div>
}
