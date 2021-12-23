/** @jsx jsx  */
import { jsx } from '@emotion/react'
import { useWindow } from 'libs'
import { FC } from 'react'
import { useRender } from 'web-utils/src/useRender'
import Loading from 'web/crud/src/legacy/Loading'
import { findPage } from '../page/util'
import { generatePage } from './generate'
import { loadPage } from './loader'

export const Page: FC<{}> = ({ children }) => {
  const { window, location } = useWindow()
  const { cms_pages } = window
  const render = useRender()

  if (location.pathname.startsWith('/__ssr/layout/')) {
    return null
  }

  const page = findPage(location.pathname, cms_pages)
  if (page) {
    const Page = preparePage({ page, render, window })
    return <Page params={page.params} />
  }

  return <div className="bg-red-300">404 - Page Not Found</div>
}

const BlankPage: React.FC<any> = ({ params }: any) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loading />
    </div>
  )
}

const preparePage = ({ page, render, window }) => {
  let Page: any = BlankPage
  if (page) {
    if (page.params) {
      window.params = {
        ...page.params,
      }
    }

    if (!page.component) {
      if (!!page.source) {
        try {
          ;(0, eval)(page.source)
        } catch (e) {
          console.log(`Failed to execute:\n\n` + page.source + `\n\n${e}`)
        }
        page.component = generatePage(page.id, window.cms_pages[page.id].render)
        Page = page.component
      } else if (!window.isSSR) {
        new Promise<void>(async (resolve) => {
          await loadPage(page)
          page.component = generatePage(page.id, page.render)
          Page = page.component
          resolve()
          render()
        })
      }
    } else {
      Page = page.component // swap empty layout with correct layout
    }
  }
  return Page
}
