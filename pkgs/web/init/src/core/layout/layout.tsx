/** @jsx jsx  */
import { jsx } from '@emotion/react'
import { useWindow } from 'libs'
import { FC, useEffect } from 'react'
import { useRender } from 'web-utils/src/useRender'
import Loading from 'web/crud/src/legacy/Loading'
import { findPage } from '../page/util'
import { generateLayout } from './generate'
import { loadLayout } from './loader'
import { Wrapper } from './wrapper'

export const Layout: FC<{}> = ({ children }) => {
  const { window, location } = useWindow()
  const { cms_pages, cms_layouts } = window
  const render = useRender()

  if (location.pathname.startsWith('/__ssr/layout/')) {
    const layout_id = location.pathname.substring(
      '/__ssr/layout/'.length,
      '/__ssr/layout/'.length + 5
    )
    const layout = cms_layouts[layout_id]
    const Layout = prepareLayout({ layout, render, window })

    return (
      <Wrapper>
        <Layout>
          <div
            id="server-page-root"
            className="flex-1 flex items-center justify-center"
          >
            <Loading />
          </div>
        </Layout>
      </Wrapper>
    )
  }

  const page = findPage(location.pathname, cms_pages)
  if (page) {
    const layout = cms_layouts[page.lid]
    const Layout = prepareLayout({ layout, render, window })

    return (
      <Wrapper>
        <Layout>{children}</Layout>
      </Wrapper>
    )
  }

  return <div className="bg-red-300">404 - Page Not Found</div>
}

const BlankLayout: React.FC<any> = ({ params, children }: any) => {
  return <>{children}</>
}

const prepareLayout = ({ layout, render, window }) => {
  let Layout: any = BlankLayout
  if (layout) {
    if (!layout.component) {
      if (!!layout.source) {
        try {
          ;(0, eval)(layout.source)
        } catch (e) {
          console.log(`Failed to execute:\n\n` + layout.source + `\n\n${e}`)
        }
        layout.component = generateLayout(
          layout.id,
          window.cms_layouts[layout.id].render
        )
        Layout = layout.component
      } else if (!window.isSSR) {
        new Promise<void>(async (resolve) => {
          await loadLayout(layout)
          layout.component = generateLayout(layout.id, layout.render)
          Layout = layout.component
          resolve()
          render()
        })
      }
    } else {
      Layout = layout.component // swap empty layout with correct layout
    }
  }
  return Layout
}
