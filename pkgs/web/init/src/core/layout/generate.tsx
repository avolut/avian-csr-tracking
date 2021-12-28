/** @jsx jsx */
import { db, useWindow, waitUntil } from 'libs'
import { observe } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { api } from 'web-utils/src/api'
import { useRender } from 'web-utils/src/useRender'
import { renderCMS } from '../internal/render'
import { renderLog } from '../internal/utils'
import { restoreObject } from '../page/util'

export const generateLayout: (id: string, cms_layout: any) => React.FC<any> = (
  id,
  cms_layout,
) => {
  if (!cms_layout) {
    console.warn(`[BASE] Layout ${id} not found: ${JSON.stringify(cms_layout)}`)
    return () => null
  }

  if (cms_layout.use_mobx) {
    return mobxRenderer(id, cms_layout)
  }

  return refRenderer(id, cms_layout)
}

const refRenderer: (id: string, cms_layout: any) => React.FC<any> = (
  id,
  cms_layout,
) => {
  const { window, location } = useWindow()
  const res = function(props: any) {
    const { params, children } = props
    const _ = useRef<Record<string, any>>(cms_layout.child_meta({ window }))
    const meta = _.current
    const _render = useRender()
    const render = (reason: string) => {
      renderLog('layout | render', reason)
      _render()
    }
    const internal = window.cms_layouts[id].running
    const loadCache = (debugLog?: string, forceChildren?: boolean) => {
      if (debugLog) {
        renderLog('layout | caches', debugLog)
      }

      if (children || forceChildren) {
        internal.lastChildren = children
      }

      return renderCMS(cms_layout, meta, {
        debugLog: 'gen-layout',
        defer: true,
        type: 'layout',
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

    // useEffect(() => {
    //   waitUntil(() => internal.cache).then(async () => {
    //     await internal.cache.loading()
    //     window.showClientRoot('all component loaded')
    //   })
    // }, [])

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
              
                  last    : ${internal.lastChildren.displayName}
                  current : ${children.displayName}
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
      render('rendering children')

      return internal.cache.page
    }

    return internal.cache.page
  }
  res.displayName = `layout: ${id}`
  return res
}

const mobxRenderer: (id: string, cms_layout: any) => React.FC<any> = (
  id,
  cms_layout,
) => {
  const { window } = useWindow()
  return observer((props) => {
    const { params, children } = props
    const render = useRender()
    const internal = window.cms_layouts[id].running

    const shouldRestoreMobxData = internal.mobx.observe === null
    if (!internal.mobx.data || shouldRestoreMobxData) {
      let oldData = false
      if (shouldRestoreMobxData)
        oldData = toJS(internal.mobx.data)

      internal.mobx.data = {}

      if (typeof cms_layout.child_meta === 'object') {
        internal.mobx.data = cms_layout.child_meta
      } else if (typeof cms_layout.child_meta === 'function') {
        internal.mobx.data = cms_layout.child_meta({ window })
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

    const loadCache = (debugLog?: string, forceChildren?: boolean) => {
      if (debugLog) {
        renderLog('layout', debugLog)
      }

      if (children || forceChildren) {
        internal.lastChildren = children
      }

      return renderCMS(cms_layout, internal.observable, {
        debugLog: 'gen-layout',
        defer: true,
        type: 'layout',
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
    } else if (!internal.init && internal.cache.loadingCount === 0) {
      internal.init = true
      render()
    }

    useEffect(() => {
      mobxObserve()
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

    // useEffect(() => {
    //   waitUntil(() => internal.cache).then(async () => {
    //     if (typeof internal.cache.loading === 'function')
    //       await internal.cache.loading()
    //     window.showClientRoot('all component loaded')
    //   })
    // }, [])

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
  })
}
