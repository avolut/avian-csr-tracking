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
import * as appGlobal from '../../../../../app/web/src/global'
import { renderCMS } from './internal/render'
import { renderLog } from './internal/utils'
import { loadPage } from './page/loader'
import { detectPlatform } from './platform'

const { window } = useWindow()

let win = {} as any
if (!window.isSSR) {
  win = window
} else {
  win.isSSR = window.isSSR
}

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
  console.log(loaders)
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
win.next = async (href: string) => {}
win.navigate = async (href: string) => {
  history.pushState({}, '', href)
  window.app.render()
}
win.next = win.navigate

// capacitor arguments callback function
// di index disini, dipanggil ketika capacitor manggil.
const capacitorACB = {
  index: new WeakMap(),
  map: new Map(),
}

export const sendCapacitor = (type: 'ready' | 'exec' | 'exit', data?: any) => {
  if (data && data.args) {
    for (let [k, arg] of Object.entries(data.args)) {
      if (typeof arg === 'function') {
        if (!capacitorACB.index.has(arg)) {
          const id = '__f:' + Math.floor(Math.random() * 1000000)
          capacitorACB.index.set(arg, {
            id,
          })
          capacitorACB.map.set(id, arg)
        }
        const id = capacitorACB.index.get(arg).id
        data.args[k] = id
      }
    }
  }

  if (!win.isSSR)
    (win as any).parent.postMessage(JSON.stringify({ type, data }), '*')
}

const capacitorResult: Record<
  string,
  { args: any; resolve: (result: any) => void }[]
> = {}

win.capacitor = window.Capacitor
// if (!win.isSSR) {
//   ;(win as any).addEventListener('message', (e) => {
//     let msg = { type: '', data: {} as any }
//     try {
//       msg = JSON.parse(e.data)
//     } catch (e) {}

//     const { data } = msg

//     switch (msg.type) {
//       case 'init-capacitor':
//         sendCapacitor('ready')
//         break
//       case 'go-back':
//         if (typeof win.onback === 'function') {
//           win.onback()
//         }
//         win.back()
//         break
//       case 'call-args':
//         if (capacitorACB.map.has(data.id)) {
//           const func = capacitorACB.map.get(data.id)
//           const params = JSON.parse(data.params)
//           func(...params)
//         }
//         break
//       case 'exec-result':
//         if (data && data.func) {
//           const results = [...capacitorResult[data.func]].reverse()
//           for (let i in results) {
//             const r = results[i]
//             if (JSON.stringify(r.args) === JSON.stringify(data.args)) {
//               capacitorResult[data.func].slice(results.length - parseInt(i), 1)
//               r.resolve(data.result)
//               break
//             }
//           }
//         }
//         break
//       case 'init-plugins':
//         if (data.plugins) {
//           const capacitor = {}
//           for (let i of data.plugins) {
//             const props = {}
//             for (let p of i.props) {
//               if (p.type === 'function') {
//                 props[p.name] = function (...args: any[]) {
//                   const func = `${i.name}.${p.name}`
//                   if (!capacitorResult[func]) {
//                     capacitorResult[func] = []
//                   }
//                   return new Promise((resolve) => {
//                     capacitorResult[func].push({ args, resolve })
//                     sendCapacitor('exec', {
//                       func,
//                       args,
//                     })
//                   })
//                 }
//               } else {
//                 Object.defineProperty(props, p.name, {
//                   get: function () {
//                     return p.type
//                   },
//                 })
//               }
//             }

//             capacitor[i.name] = props
//           }
//           win.capacitor = capacitor
//         }
//         break
//     }
//   })
// }

if (window.isSSR) {
  for (let [k, v] of Object.entries(win)) {
    window[k] = v
    if (!global[k]) global[k] = v
  }
}
