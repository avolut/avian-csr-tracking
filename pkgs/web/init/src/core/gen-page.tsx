/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import Page from 'framework7-react/esm/components/page'
import { db, dbAll, waitUntil } from 'libs'
import get from 'lodash.get'
import { observer, useLocalObservable } from 'mobx-react-lite'
import React, { Fragment, lazy, Suspense, useEffect } from 'react'
import * as appBase from 'web-app/base'
import { api } from 'web-utils/src/api'
import { useRender } from 'web-utils/src/useRender'
import { Link } from 'web-view/src/Link'
import mLink from '../../../mobile/src/m-link'
import { BaseWindow } from '../window'
import { deepObserve } from './mobx/deep-observe'
import { formatJsxChildren } from './utils'
declare const window: BaseWindow
declare const apbase: typeof appBase

export const generatePage = (
  cms_page: any,
  opt: { params: any; updateParams: (newdata: any) => void }
) => {
  const { params } = opt
  cms_page.params = params
  window.params = params

  const _ = {
    init: false,
    mobx: {} as {
      observe: any
      data: any
      renderTimeout: any
    },
    observable: null as any,
    reload: () => {},
    cache: null as null | ReturnType<typeof renderCMS>,
  }
  return observer(({ init }: any) => {
    const render = useRender()
    const internal = _

    if (!internal.mobx.data) {
      internal.mobx.data =
        typeof cms_page.child_meta === 'object' ? cms_page.child_meta : {}
    }

    internal.observable = useLocalObservable(() => internal.mobx.data)

    const mobxObserve = () => {
      if (internal.mobx.observe) {
        internal.mobx.observe()
      }
      internal.mobx.observe = deepObserve(internal.observable, (changes) => {
        if (internal.mobx.renderTimeout) {
          clearTimeout(internal.mobx.renderTimeout)
        }
        internal.mobx.data = toJS(internal.observable)

        internal.mobx.renderTimeout = setTimeout(() => {
          internal.cache = loadCache('mobx changed')
          if (internal.cache.loading) {
            internal.cache.loading().then(async () => {
              internal.cache = loadCache('finished loading components')
              while (internal.cache.loading) {
                await internal.cache.loading
                internal.cache = loadCache('finished loading components')
              }
              render()
            })
          } else {
            render()
          }
        })
      })
    }

    const loadCache = (debugLog?: string) => {
      // if (debugLog) console.log('[page]', (debugLog || '').trim())

      return renderCMS(cms_page, internal.observable, {
        debugLog: 'gen-page',
        defer: true,
        type: 'page',
        params,
        render,
      })
    }
    if (internal.cache === null) {
      internal.cache = loadCache('init')
      if (internal.cache.loading) {
        internal.cache.loading().then(async () => {
          internal.cache = loadCache('finished loading components')
          while (internal.cache.loading) {
            await internal.cache.loading
            internal.cache = loadCache('finished loading components')
          }
          render()
        })
      } else {
        render()
      }
    } else if (!internal.init && internal.cache.loadingCount === 0) {
      internal.init = true
      render()
    }

    internal.cache.effects.forEach((e) => {
      useEffect(() => {
        waitUntil(() => internal.init).then(() => {
          mobxObserve()

          e.run({
            meta: internal.observable,
            dev: false,
            db: db,
            dbAll: dbAll,
            api: api,
          })
        })
      }, [...(e.deps || [])])
    })

    return internal.cache.page
  })
}

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
  const loading: Record<string, Promise<any>> = {}
  const effects = new Set<{ deps: any[]; run: (props: any) => void }>()
  const h = (tag: string, props: any, ...children: any[]) => {
    let finalProps: any = undefined

    if (tag === 'img' && get(props, 'src', '').indexOf('/fimgs/') === 0) {
      if (!window.figmaImageCaches) {
        window.figmaImageCaches = {}
      }
      if (!window.figmaImageCaches[props.src]) {
        window.figmaImageCaches[props.src] = new Image()
        window.figmaImageCaches[props.src].src = props.src
      }
    }
    let component: undefined | React.FC<any> = undefined
    let def = window.cms_components[tag]
    if (def) {
      if (!def.loaded) {
        if (!def.loading) {
          const ext = def.load()

          if (ext[0] instanceof Promise) {
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
                const res = await fetch(`/__component/${tag}.js`)
                const text = await res.text()
                if (text === 'null') {
                  componentNoJSX[tag] = true
                } else {
                  def.template.code = text
                }
              }

              def.template.loading = false

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
      component = def.component
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

    if (component) {
      if (!finalProps) finalProps = {}

      if (component === Fragment) {
        for (let k of Object.keys(finalProps)) {
          if (k !== 'key') delete finalProps[k]
        }
      }
    }
    const result = jsx(
      component ? component : tag,
      finalProps,
      ...children.map(formatJsxChildren.bind({ component, tag, cmsPage }))
    )

    return result
  }

  const params = opt.params || {}
  params.isDev = !!window.is_dev

  let page = <></>

  const baseRunner: typeof base = (effect, content) => {
    return (
      <>
        {h('effect', { meta: effect.meta, run: effect.init })}
        {content(
          { meta: meta as any, children: opt.children },
          (cmsPage as any).__extract
        )}
      </>
    )
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
            // if (window.is_dev)
            //   console.log(
            //     '[base] loading:',
            //     Object.keys(loading)
            //       .map((e) => `<${e}/>`)
            //       .join(' ')
            //   )
            await Promise.all(Object.values(loading))
            return true
          }
        : undefined,
    effects,
  }
}

window.renderCMS = renderCMS
