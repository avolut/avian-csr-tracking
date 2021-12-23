/** @jsx jsx */
import createCache from '@emotion/cache'
import { CacheProvider, css, jsx } from '@emotion/react'
import { useWindow } from 'libs'
import React, { FC, ReactElement } from 'react'
import { createRoot } from 'react-dom'
import 'regenerator-runtime'
import { Main } from './core/main'
import { reloadAllComponents } from './core/platform'
import type { BaseWindow } from './window'
declare const window: BaseWindow

export type BaseHtml = React.FC<{
  ssr: any
  timestamp: number | string
  injectCSS: ReactElement
  injectJS: ReactElement
  ssrChildren?: ReactElement
}>

if (typeof window !== 'undefined' && !window.isSSR) {
  const cache = createCache({
    key: 'css',
  })
  window.emotionCache = cache
}

export const platform = (defaultPlatform: 'web' | 'mobile') => {
  const { window } = useWindow()
  window.platform = defaultPlatform
}

export const hostname = (
  func: (arg: {
    port: number
    mode: 'dev' | 'prod'
    window: BaseWindow
  }) => string
) => {
  const { window } = useWindow()

  window.hostname = func({
    port: window.cli_port,
    mode: window.is_dev ? 'dev' : 'prod',
    window,
  })
}

export const start = (html: BaseHtml) => {
  if (typeof window !== 'undefined') {
    if (window.is_dev) {
      import('./hmr').then(({ initHmr }) => {
        initHmr()
      })
    }

    ssr(window as any, html)
  }
}

export const ssr = async (window: BaseWindow & Window, Html: BaseHtml) => {
  if (window.cms_id === '00000') {
    const res = await fetch(`${window.hostname}/__init${location.pathname}`)
    ;(0, eval)('window.basePack = ' + (await res.text()))
    for (let [k, v] of Object.entries(window.basePack)) {
      window[k] = v
    }
  }

  window.global = {} as any
  const isSSRLayout = window.location.pathname.startsWith('/__ssr/layout')

  await reloadAllComponents()
  const App: FC<{ ssr?: string }> = (prop) => {
    const { window } = useWindow()
    return (
      <Html
        ssr={prop.ssr}
        timestamp={window.tstamp || ''}
        injectCSS={
          <>
            {Object.keys(window.inject_css || {}).map((e) => (
              <link rel="stylesheet" href={e} key={e} />
            ))}
          </>
        }
        injectJS={
          prop.ssr ? (
            <script
              id="base-pack"
              dangerouslySetInnerHTML={{
                __html: `window.basePack = ${prop.ssr};for (let [k,v] of Object.entries(window.basePack)) { window[k] = v }`,
              }}
            />
          ) : (
            <></>
          )
        }
        ssrChildren={isSSRLayout ? <Main /> : undefined}
      ></Html>
    )
  }
  if (window.isSSR) {
    global.React = React
    return { App, jsx, css, CacheProvider }
  }
  import('./core/window').then(async () => {
    const el = document.getElementById('client-root')

    if (el && !isSSRLayout && !window.isSSR) {
      const root = createRoot(el)
      root.render(
        <CacheProvider value={window.emotionCache}>
          <Main />
        </CacheProvider>
      )
    }
  })
  return { App, jsx, css, CacheProvider }
}
