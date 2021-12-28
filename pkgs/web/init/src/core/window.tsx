/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { db, matchRoute, useWindow, waitUntil } from 'libs'
import get from 'lodash.get'
import set from 'lodash.set'
import { action, observable, runInAction, toJS } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { api } from 'web-utils/src/api'
import { loadExt } from 'web-utils/src/loadExt'
import { renderCMS } from './internal/render'
import { renderLog } from './internal/utils'
import { loadPage } from './page/loader'
import { detectPlatform } from './platform'

const { window } = useWindow()

const initWin = async () => {
  let win = {} as any

  if (!window.isSSR) {
    win = window
  } else {
    win.isSSR = window.isSSR
  }

  const appGlobal = (await import('../../../../../app/web/src/global'))

  for (let [k, v] of Object.entries(appGlobal)) {
    win[k] = v
  }

  if (!(win as any).process) {
    ;(win as any).process = { env: {} }
  }

  if (window.secret && (window.secret as any).type === 'Buffer') {
    window.secret = (window.secret as any).data
  }

  win.figmaAsk = {
    lastId: 0,
    answers: {},
    callbacks: {},
  }

  win.renderCMS = renderCMS
  win.user = observable(win.user)
  win.set = set
  win.get = get
  win.toJS = toJS
  win.useEffect = useEffect
  win.useRef = useRef
  win.api = api
  win.db = db as any
  win.waitUntil = waitUntil
  win.loadExt = loadExt
  win.sql = (texts: string[], ...args: any[]) => {
    let final = [] as any[]
    for (let i of texts) {
      final.push(i)
      const arg = args.shift()
      if (typeof arg !== 'undefined') {
        final.push(arg)
      }
    }

    return final.join('')
  }

  win.preload = async (urls: string[]) => {
    const loaders: Promise<any>[] = []
    for (let url of urls) {
      for (let [k, page] of Object.entries(window.cms_pages)) {
        if (k) {
          if (page && matchRoute(url, k)) {
            loaders.push(loadPage(page))
          }
        }
      }
    }
    await Promise.all(loaders)
  }

  if (!win.platform) {
    detectPlatform()
  }

  let showClientRootTimeout = null as any
  win.showClientRoot = (reason?: string) => {
    clearTimeout(showClientRootTimeout)
    showClientRootTimeout = setTimeout(() => {
      const sel = document.querySelectorAll('[data-ssr]')
      renderLog('compnt | loader', 'show client root:' + reason)
      if (sel) {
        sel.forEach((e) => {
          if (e.getAttribute('id') === 'server-root') {
            e.classList.add('transition-opacity', 'opacity-0')
            setTimeout(() => {
              e.remove()
            }, 300)
          } else {
            e.remove()
          }
        })
      }
    }, 500)
  }

  win.React = React
  win.jsx = jsx
  win.css = css
  win.useState = useState
  win.runInAction = runInAction
  win.action = action
  win.css = css
  win.fragment = Fragment
  win.observer = observer
  win.useLocalObservable = useLocalObservable
  win.babel = {}
  if (!win.isSSR) {
    ;(win as any).addEventListener('popstate', (e) => {
      if (window.preventPopChange) {
        window.preventPopChange = false
        return
      }
      window.app.render()
    })
  }
  win.back = async () => {
    history.back()
  }
  win.next = async (href: string) => {
  }
  win.navigate = async (href: string) => {
    history.pushState({}, '', href)
    window.app.render()
  }
  win.next = win.navigate

  win.capacitor = window.Capacitor

  if (window.isSSR) {
    for (let [k, v] of Object.entries(win)) {
      window[k] = v
      if (!global[k]) global[k] = v
    }
  }

}
export default initWin()