/** @jsx jsx */
import { db, useWindow, waitUntil } from 'libs'
import { configure, observe } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { api } from 'web-utils/src/api'
import { useRender } from 'web-utils/src/useRender'
import { renderCMS } from '../internal/render'
import { renderLog } from '../internal/utils'
import { restoreObject } from './util'

configure({
  enforceActions: 'never',
})

const initFromStatic = () => {
  const { window } = useWindow()
  window.showClientRoot('loaded from mobile app')
}

export const generatePage: (id: string, cms_page: any) => React.FC<any> = (
  id,
  cms_page,
) => {
  const { window } = useWindow()
  if (!cms_page) {
    console.warn(`[BASE] Page ${id} not found: ${JSON.stringify(cms_page)}`)
    return () => null
  }

  if (
    typeof window.cms_pages[id].running === 'undefined' &&
    cms_page.child_meta
  ) {
    window.cms_pages[id].running = {
      init: false,
      cache: null,
      lastChildren: null,
      lastUrl: '',
      mobx: {
        data: cms_page.child_meta({ window }),
        observe: null,
        renderTimeout: null,
      },
      observable: null,
    }
  }

  if (cms_page.use_mobx) {
    return mobxRenderer(id, cms_page)
  }

  return refRenderer(id, cms_page)
}

const refRenderer: (id: string, cms_page: any) => React.FC<any> = (
  id,
  cms_page,
) => {
  const { window, location } = useWindow()
  const res = function(props: any) {
    const { params, children } = props
    const _ = useRef<Record<string, any>>(cms_page.child_meta({ window }))
    const meta = _.current
    const _render = useRender()
    const render = (reason: string) => {
      renderLog('page | render', reason)
      _render()
    }

    const internal = window.cms_pages[id].running
    const loadCache = (debugLog?: string, forceChildren?: boolean) => {
      if (debugLog) {
        renderLog('page | caches', debugLog)
      }

      if (children || forceChildren) {
        internal.lastChildren = children
      }

      return renderCMS(cms_page, meta, {
        debugLog: 'gen-page',
        defer: true,
        type: 'page',
        params,
        render: () => {
          render('cms render')
        },
        children: internal.lastChildren,
      })
    }

    if (internal.lastUrl && internal.lastUrl !== location.pathname) {
      internal.cache = loadCache(
        `url changed` +
        `
                  last    : ${internal.lastUrl}
                  current : ${location.pathname}`,
      )
      internal.lastUrl = location.pathname
    } else {
      internal.lastUrl = location.pathname
    }

    if (internal.cache === null) {
      internal.cache = loadCache('init')
      if (internal.cache.loading) {
        internal.cache.loading().then(async () => {
          internal.cache = loadCache('finished loading components')
          while (internal.cache.loading) {
            await internal.cache.loading()
            internal.cache = loadCache('finished loading components')
          }
          internal.init = true
          render('rendering loaded components, freshly cached')
        })
      } else {
        internal.init = true
        render('rendering loaded components, cached')
      }
    } else if (!internal.init && internal.cache.loadingCount === 0) {
      internal.init = true
      render(`internal.init is false and loadingCount is zero`)
    }

    useEffect(() => {
      if (window.cms_id === '00000' || document.querySelector('[data-ssr]')) {
        initFromStatic()
      }
      waitUntil(() => internal.cache).then(async () => {
        if (internal.cache.loadingCount === 0) {
          window.showClientRoot('all component loaded')
        }
      })
    }, [])

    internal.cache.effects.forEach((e) => {
      useEffect(() => {
        waitUntil(() => internal.init).then(() => {
          e.run({
            meta,
            params: params,
            dev: false,
            window,
            db: db,
            render: () => {
              if (internal.cache) {
                if (internal.cache.loading) {
                  waitUntil(() => !internal.cache?.loading).then(() => {
                    internal.cache = loadCache(
                      're-rendering components from children',
                    )
                    render('render from children effect')
                  })
                } else {
                  internal.cache = loadCache(
                    're-rendering components from children',
                  )
                  render('render from children effect')
                }
              }
            },
            api: api,
          })
        })
      }, [...(e.deps || [])])
    })

    if (
      !internal.cache.loading &&
      (!internal.lastChildren ||
        (children &&
          internal.lastChildren &&
          children !== internal.lastChildren))
    ) {
      internal.cache = loadCache(
        `children changed: ` +
        (children !== internal.lastChildren
          ? 'not equal with last children' +
          `
              
                  last    : ${
            internal.lastChildren
              ? internal.lastChildren.displayName
              : ''
          }
                  current : ${children ? children.displayName : ''}
`
          : 'no last children'),
        true,
      )

      if (internal.cache.loading) {
        internal.cache.loading().then(async () => {
          internal.cache = loadCache('finished loading components')
          while (internal.cache.loading) {
            await internal.cache.loading()
            internal.cache = loadCache('finished loading components')
          }

          render('rendering children with component')
        })
      }

      return internal.cache.page
    }

    return internal.cache.page
  }
  res.displayName = `page: ${id}`
  return res
}

const mobxRenderer: (id: string, cms_page: any) => React.FC<any> = (
  id,
  cms_page,
) => {
  const { window } = useWindow()
  return observer((props) => {
      const { params, children } = props
      const render = useRender()
      const internal = window.cms_pages[id].running


      const shouldRestoreMobxData = internal.mobx.observe === null
      if (!internal.mobx.data || shouldRestoreMobxData) {
        let oldData = false
        if (shouldRestoreMobxData)
          oldData = toJS(internal.mobx.data)

        internal.mobx.data = {}

        if (typeof cms_page.child_meta === 'object') {
          internal.mobx.data = cms_page.child_meta
        } else if (typeof cms_page.child_meta === 'function') {
          internal.mobx.data = cms_page.child_meta({ window })
        }

        if (shouldRestoreMobxData && typeof oldData === 'object') {
          restoreObject(oldData, internal.mobx.data)
        }
      }

      internal.observable = useLocalObservable(() => internal.mobx.data)

      const mobxObserve = () => {
        if (internal.mobx.observe) {
          internal.mobx.observe()
        }
        internal.mobx.observe = observe(internal.observable, () => {
          if (internal.mobx.renderTimeout) {
            clearTimeout(internal.mobx.renderTimeout)
          }
          internal.mobx.data = internal.observable

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

      const loadCache = (debugLog?: string, forceChildren?: boolean) => {
        if (debugLog) {
          renderLog('page', debugLog)
        }

        if (children || forceChildren) {
          internal.lastChildren = children
        }

        return renderCMS(cms_page, internal.observable, {
          debugLog: 'gen-page',
          defer: true,
          type: 'page',
          params,
          render,
          children: internal.lastChildren,
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
      } else if (
        !internal.init &&
        internal.cache &&
        internal.cache.loadingCount === 0
      ) {
        internal.init = true
        render()
      }

      useEffect(() => {
        mobxObserve()
        if (window.cms_id === '00000' || document.querySelector('[data-ssr]')) {
          initFromStatic()
        }

        return () => {
          if (internal.mobx.observe) {
            internal.mobx.observe()
            internal.mobx.observe = null
          }
        }
      }, [])

      internal.cache.effects.forEach((e) => {
        useEffect(() => {
          waitUntil(() => internal.init).then(() => {
            e.run({
              meta: internal.observable,
              params: params,
              dev: false,
              db: db,
              window,
              api: api,
            })
          })
        }, [...(e.deps || [])])
      })

      if (children !== internal.lastChildren || !internal.lastChildren) {
        internal.cache = loadCache('children changed', true)
        if (internal.cache.loading) {
          internal.cache.loading().then(async () => {
            internal.cache = loadCache('finished loading components')
            while (internal.cache.loading) {
              await internal.cache.loading
              internal.cache = loadCache('finished loading components')
            }

            render()
          })
        }
        return internal.cache.page
      }

      return internal.cache.page
    },
  )
}
