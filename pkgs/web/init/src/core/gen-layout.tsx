/** @jsx jsx */
import { db, dbAll, waitUntil } from 'libs'
import { observe } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useEffect } from 'react'
import { api } from 'web-utils/src/api'
import { useRender } from 'web-utils/src/useRender'
import { BaseWindow } from '../window'
import { renderCMS } from './gen-page'
declare const window: BaseWindow

export const generateLayout: (id: string, cms_layout: any) => React.FC<any> = (
  id: string,
  cms_layout: any
) => {
  return observer((props) => {
    const { params, children, init } = props
    const render = useRender()
    const internal = window.cms_layouts[id].running

    if (!internal.mobx.data) {
      internal.mobx.data =
        typeof cms_layout.child_meta === 'object' ? cms_layout.child_meta : {}
    }

    internal.observable = useLocalObservable(() => internal.mobx.data)

    const mobxObserve = () => {
      if (internal.mobx.observe) {
        internal.mobx.observe()
      }
      internal.mobx.observe = observe(internal.observable, (changes) => {
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
      // if (debugLog) console.log('[layout]', (debugLog || '').trim(), children)

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

    internal.cache.effects.forEach((e) => {
      useEffect(() => {
        waitUntil(() => internal.init).then(() => {
          mobxObserve()

          e.run({
            meta: internal.observable,
            params: params,
            dev: false,
            db: db,
            dbAll: dbAll,
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
  })
}
