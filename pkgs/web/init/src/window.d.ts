import type { parse } from '@babel/core'
import generate from '@babel/generator'
import traverse from '@babel/traverse'
import { css, jsx } from '@emotion/react'
import type { db as _db } from 'db'
import { db, waitUntil } from 'libs'
import type _get from 'lodash.get'
import get from 'lodash.get'
import set from 'lodash.set'
import type createCache from '@emotion/cache'
import type { toJS as _toJS } from 'mobx'
import { action, runInAction, toJS } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import React, {
  FC,
  Fragment,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import { api } from 'web-utils/src/api'
import { loadExt } from 'web-utils/src/loadExt'
import type * as glb from '../../../../app/web/src/global'
import { generatePage, renderCMS } from './core/gen-page'
import { findPage } from './core/load-page'
export type SingleFallback = {
  c: string
  s: string
  h: string
}

declare type FigmaTab = 'page' | 'css' | 'code' | 'effect'

declare global {
  const toJS: typeof _toJS
  const get: typeof _get
  type API = Record<string, any> & { db: typeof _db }
}

// export type InitPack = Exclude<Awaited<ReturnType<typeof initPage>>, undefined>

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type ExcludeDollar<T extends string> = T extends `$${string}` ? never : T

export interface BaseWindow extends glb {
  isSSR: boolean
  figmaAsk: {
    lastId: 0
    answers: {}
    callbacks: Record<string, any>
  }
  figmaImageCaches: Record<string, HTMLImageElement>

  emotionCache: ReturnType<typeof createCache>
  hostname: string
  cli_port: number
  inject_css: Record<string, true>
  basePack: InitPack
  assets: Record<string, string>
  showClientRoot: (reason?: string) => void

  preload: (urls: string[]) => Promise<void>

  tstamp: number // server render timestamp
  params: any
  global: typeof window
  crudStateID: number
  pdfStateID: number
  preventPopChange: boolean
  /** module stuff */
  get: typeof get
  set: typeof set
  React: typeof React
  useState: typeof useState
  useEffect: typeof useEffect
  useRef: typeof useRef
  fragment: typeof Fragment
  toJS: typeof toJS
  runInAction: typeof runInAction
  action: typeof action
  jsx: typeof jsx
  css: typeof css
  observer: typeof observer
  useLocalObservable: typeof useLocalObservable
  Fallback: any
  loadExt: typeof loadExt
  secret: Uint8Array
  baseFormFieldTypes: any

  sql: (
    text: string[],
    ...args: any[]
  ) => string | [string, Record<string, any>]

  /** capacitor */
  Capacitor: { Plugins: Record<string, any> }

  /** init stuff */
  process: {
    env?: {
      MODE: 'development' | 'production'
    }
  }
  is_dev: boolean
  ws_dev?: WebSocket & {
    onConnected?: (ws: BaseWindow['ws_dev']) => void
    onDisconnected?: (ws: BaseWindow['ws_dev']) => void
    onReceive?: (msg: any, ws: BaseWindow['ws_dev']) => void
    packAndSend: (msg: any) => void
  }
  back: (url?: string) => Promise<void>
  navigate: (href: string) => Promise<void>
  waitUntil: typeof waitUntil
  imported: Record<string, any>

  babel: {
    prettier?: (str: string) => string
    generate?: typeof generate
    traverse?: typeof traverse
    parse?: typeof parse
  }

  /** template stuff */
  cms_components: Record<
    string,
    {
      loaded: boolean
      loading: boolean
      load: () => [
        { default: React.FC<any> } | Promise<{ default: React.FC<any> }>,
        { c: string; s: string; h: string }
      ]
      cache?: any
      template: { code: string; loading: boolean }
      instance?: React.FC<any>
      component: React.FC<any>
    }
  >
  cms_layouts: Record<
    string,
    {
      id: string
      name: string
      running: {
        init: boolean
        observable: any
        lastChildren: any
        lastUrl: any
        mobx: {
          observe: any
          data: any
          renderTimeout: any
        }
        cache: null | ReturnType<typeof renderCMS>
      }
      component?: React.FC<any>
      source?: string
      render?: () => ReactElement
    }
  >
  cms_pages: Record<
    string,
    {
      id: string
      url: string
      lid: string // layoutID
      sol: boolean // serverOnLoad
      name: string
      running: {
        init: boolean
        observable: any
        lastChildren: any
        lastUrl: any
        mobx: {
          observe: any
          data: any
          renderTimeout: any
        }
        cache: null | ReturnType<typeof renderCMS>
      }
      render?: () => ReactElement
      component?: React.FC
      params?: any
      cache?: ReturnType<typeof generatePage>
    }
  >
  renderCMS: typeof renderCMS

  /** page stuff */
  cms_id: string

  db: Omit<typeof db, '$queryRaw'> & { query: (q: string) => Promise<any[]> }
  api: typeof api
  user: any
  platform: 'web' | 'mobile'
  build_id: string

  mobileListHideInfo?: boolean
  baseListComponent: null | Record<string, { Table: FC; Filter: FC }>

  /** dev stuff */
  Buffer?: any
  devAskPlatform: {
    lastId: 0
    answers: {}
    callbacks: Record<string, any>
  }
  devUnsaved?: boolean
  devFormatCode?: () => Promise<void>
  devIsComponentEditorOpen?: boolean

  app: {
    render: () => void
  }
}
