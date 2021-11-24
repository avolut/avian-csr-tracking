/** @jsx jsx */
import F7Page from 'framework7-react/esm/components/page'
import { ellapsedTime, matchRoute } from 'libs'
import React, { FC, Fragment, useRef } from 'react'
import { api } from 'web-utils/src/api'
import { useRender } from 'web-utils/src/useRender'
import { BaseWindow } from '../window'
import { generateLayout } from './gen-layout'
import { generatePage } from './gen-page'
import { findPage, loadLayout, loadPageRenderer } from './load-page'

const BlankLayout: React.FC<any> = ({ params, children }: any) => {
  const Wrapper = window.platform === 'mobile' ? F7Page : Fragment
  return <Wrapper>{children}</Wrapper>
}
const ms = new Date().getTime()
declare const window: BaseWindow
export const renderCore = ({
  NotFound,
  afterRender,
  init,
}: {
  init: boolean
  NotFound: FC
  afterRender?: () => void
}) => {
  let url = location.pathname

  const _ = useRef({
    page: findPage(url) as ReturnType<typeof findPage>,
    params: getUrlParams(url),
    Layout: BlankLayout,
  })

  const render = useRender()
  const meta = _.current

  const layoutArgs = {}
  layoutArgs['params'] = meta.params
  let Layout = meta.Layout

  if (typeof meta.page === 'object') {
    window.cms_id = meta.page.id
    window.cms_page = meta.page
    window.cms_layout_id = meta.page.lid
    const layout = window.cms_layouts[meta.page.lid]

    let isLayoutPending = null as any

    if (layout && meta.Layout === BlankLayout) {
      if (!layout.component) {
        if (!!layout.source) {
          if (!document.getElementById('cms_layout_' + layout.id)) {
            var headNode = document.getElementsByTagName('head')[0]
            var script = document.createElement('script')
            script.innerHTML = layout.source
            // script.src = `/__layout/${layout.id}.js`
            script.id = 'cms_layout_' + layout.id
            headNode.append(script)
          }

          layout.component = generateLayout(
            layout.id,
            window.cms_layouts[layout.id].render
          )
          meta.Layout = layout.component
        } else {
          isLayoutPending = new Promise<void>(async (resolve) => {
            await loadLayout(layout)
            layout.component = generateLayout(layout.id, layout.render)
            meta.Layout = layout.component
            resolve()
          })
        }
      } else {
        meta.Layout = layout.component // swap empty layout with correct layout
      }
    }
    Layout = meta.Layout

    if (meta.page.render) {
      if (meta.page && !meta.page.cache) {
        loadPageCache({ meta, render, url })
      }
    } else {
      loadPageRenderer(meta.page).then(() => {
        window.pageRendered = true
        render()
      })
    }

    const Page = meta.page ? meta.page.cache : null

    if (afterRender) {
      setTimeout(() => {
        afterRender()
      })
    }

    return (
      <Layout {...layoutArgs} init={init}>
        {Page ? (
          <ErrorBoundary>
            <Page init={init} />
          </ErrorBoundary>
        ) : null}
      </Layout>
    )
  }
  return <NotFound />
}

const loadPageCache = ({ meta, url, render }) => {
  let serverOnLoad = null as any
  if (meta.page.sol) {
    serverOnLoad = new Promise<any>(async (resolve) => {
      let result = {}
      if (meta.page) {
        result = await api(`/__params/${meta.page.id}`, {
          url,
        })
      }
      resolve(result)
    })
  }

  const loadCache = () => {
    if (meta.page) {
      try {
        meta.page.cache = generatePage(meta.page.render, {
          params: { ...meta.params, url: url },
          updateParams: (newparams) => {
            meta.params = newparams
            window.params = meta.params
          },
        })
      } catch (e) {
        console.log('Failed to render page', e)
      }
    }
  }

  if (serverOnLoad) {
    serverOnLoad.then((params) => {
      if (meta.page) {
        if (params && typeof params === 'object') {
          for (let [k, v] of Object.entries(params)) {
            meta.params[k] = v
          }
        }
        loadCache()
        render()
      }
    })
  } else {
    loadCache()
  }
}

export const getUrlParams = (url: string) => {
  const route = Object.keys(window.cms_pages)
    .map((e) => ({ route: matchRoute(url, e) }))
    .filter((e) => e.route)

  if (route.length > 0) {
    return { ...route[0].route, url, ...window.params }
  }
  return {}
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}
