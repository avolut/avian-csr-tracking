/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import Page from 'framework7-react/esm/components/page'
import { db, useWindow, waitUntil } from 'libs'
import get from 'lodash.get'
import React, { Component, Fragment, lazy, Suspense } from 'react'
import { api } from 'web-utils/src/api'
import { Link } from 'web-view/src/Link'
import {} from '../../../../../../app/web/base'
import mLink from '../../../../mobile/src/m-link'
import { formatJsxChildren, renderLog } from './utils'

const componentNoJSX = {}

export const renderCMS = (
  cmsPage: (
    db: any,
    api: any,
    action: any,
    runAction: any,
    h: (tag: any, props: any, ...children: any) => any,
    fragment: any,
    row: any,
    layout: any,
    user: any,
    params: any,
    css: any,
    meta: any,
    base: any,
    children?: any
  ) => any,
  meta: any,
  opt: {
    debugLog?: string
    children?: any
    type: 'component' | 'layout' | 'page'
    defer: boolean
    params: any
    render: () => void
  }
): {
  page: React.ReactElement
  loadingCount: number
  loading?: () => Promise<true>
  effects: Set<{ meta?: any; deps: any[]; run: (props: any) => void }>
} => {
  const { window } = useWindow()
  const loading: Record<string, Promise<any>> = {}
  const effects = new Set<{ deps: any[]; run: (props: any) => void }>()

  const h = (tag: string, props: any, ...children: any[]) => {
    let finalProps: any = undefined

    if (tag === 'img') {
      if (get(props, 'src', '').indexOf('/fimgs/') === 0) {
        if (!window.figmaImageCaches) {
          window.figmaImageCaches = {}
        }
        if (!window.figmaImageCaches[props.src]) {
          window.figmaImageCaches[props.src] = window.isSSR
            ? ({} as any)
            : new Image()
          window.figmaImageCaches[props.src].src = props.src
        }
      }
    }
    let component: undefined | React.FC<any> = undefined
    let def = window.cms_components[tag]
    if (tag === 'a') {
      if (window.platform === 'mobile') {
        component = mLink
      } else {
        component = Link
      }
    }
    if (tag === 'fragment' || tag === 'fnode') {
      component = Fragment
    }
    if (tag === 'effect') {
      if (!effects.has(props) && typeof props.run === 'function') {
        effects.add(props)
      }
      return ''
    }
    if (tag === 'html-head') {
      return ''
    }
    if (def && !component) {
      if (!def.loaded) {
        if (!def.loading) {
          const ext = def.load()

          if (ext[0] instanceof Promise) {
            suspendLoad({ def, tag, ext })
          } else {
            def.loaded = true
            def.loading = false
            const module = ext[0]

            let result = module.default
            if (!result) {
              result = module[Object.keys(module).shift() || '']
            }
            def.component = result
          }
        } else {
          loading[tag] = new Promise<void>((resolve) => {
            waitUntil(() => window.cms_components[tag].loaded).then(resolve)
          })
          return ''
        }
      }
      component = (props) => {
        const Component = def.component
        return (
          <ComponentError name={tag}>
            <Component {...props} />
          </ComponentError>
        )
      }
    }

    if (props) {
      finalProps = {}

      for (let [k, v] of Object.entries(props)) {
        switch (k) {
          case 'style':
            if (typeof v === 'string') {
              finalProps['css'] = css`
                ${v}
              `
            } else if (typeof v === 'object' && !!(v as any).styles) {
              finalProps['css'] = v
            }
            break
          case 'class':
            finalProps['className'] =
              (props['className'] ? props['className'] + ' ' : '') + v
            break
          case 'for':
            finalProps['htmlFor'] = v
            break
          default:
            finalProps[k] = v
            break
        }
      }
    }

    if (component) {
      if (!finalProps) finalProps = {}

      if (component === Fragment) {
        for (let k of Object.keys(finalProps)) {
          if (k !== 'key') delete finalProps[k]
        }
      }
    }

    // if (tag === 'img') {
    //   if (finalProps && !finalProps.onError) {
    //     finalProps.onError = (e: any) => {
    //       e.target.onerror = null
    //       e.target.setAttribute('style', `max-width:32px;max-height:32px;`)
    //       e.target.src = '/__ext/icons/image.png'
    //     }
    //   }
    // }
    const result = jsx(
      component ? component : tag,
      finalProps,
      ...children.map(formatJsxChildren.bind({ component, tag, cmsPage }))
    )

    return result
  }
  const suspendLoad = ({ def, tag, ext }) => {
    def.loading = true
    def.loaded = false

    loading[tag] = new Promise<any>(async (resolve) => {
      let result: React.FC<any> = () => {
        return <></>
      }
      const module = await ext[0]
      result = module.default
      if (!result) {
        result = module[Object.keys(module).shift() || '']
      }
      def.component = result

      if (!def.template.code && !componentNoJSX[tag]) {
        try {
          const baseUrl = window.isSSR ? `http://localhost:${global.port}` : ''
          const res = await fetch(`${baseUrl}/__component/${tag}.js`)
          const text = await res.text()
          if (text === 'null') {
            componentNoJSX[tag] = true
          } else {
            def.template.code = text
          }
        } catch (e) {
          componentNoJSX[tag] = true
        }
      }

      def.template.loading = false
      renderLog('compnt | loader', `initial loading component <${tag}/>`)

      def.loaded = true
      def.loading = false

      resolve(result)

      if (loadingCount === 0 && opt && opt.render) {
        opt.render()
      }
    })
    const SuspendedComponent = lazy(async () => {
      await loading[tag]
      return {
        default: def.component,
      }
    })
    def.component = (props) => (
      <Suspense fallback={null}>
        <SuspendedComponent {...props} />
      </Suspense>
    )
  }

  const params = opt.params || {}
  params.isDev = !!window.is_dev

  let page = <></>

  const baseRunner: typeof base = (effect, content) => {
    try {
      return (
        <>
          {h('effect', { meta: effect.meta, run: effect.init })}
          {content(
            {
              meta: meta as any,
              children: opt.children,
              window: window as any,
              render: opt.render,
            },
            (cmsPage as any).__extract
          )}
        </>
      )
    } catch (e) {
      console.error(e)
      return <></>
    }
  }

  page = cmsPage(
    db,
    api,
    window.action,
    window.runInAction,
    h,
    window.fragment,
    {},
    {},
    window.user,
    params,
    css,
    meta,
    baseRunner,
    opt.children
  )

  const loadingCount = Object.keys(loading).length
  if (loadingCount > 0 && opt.defer) {
    page = <></>
    if (window.platform === 'mobile' && opt.type === 'layout') {
      const Wrapper = Page
      page = <Wrapper />
    }
  }

  return {
    page: page,
    loadingCount,
    loading:
      loadingCount > 0
        ? async () => {
            await Promise.all(Object.values(loading))
            return true
          }
        : undefined,
    effects,
  }
}

class ComponentError extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = { hasError: false, name: props.name }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border-red-400 border-2 text-red-700 m-2 rounded-md p-2 flex flex-col">
          Error in &lt;{this.state.name} /&gt;:
          <div className="text-xs mt-1 font-mono">
            {this.state.error.toString()}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
