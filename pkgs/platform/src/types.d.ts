import type prismasdk from '@prisma/sdk'
import { db } from 'db'
import type { BaseHistory } from 'dev/src/base/history'
import type esbuild from 'esbuild'
import { requestContext } from 'fastify-request-context'
import type lmdb from 'lmdb'
import type { Database, RootDatabase } from 'lmdb'
import type msgpackr from 'msgpackr'
import type prettier from 'prettier'
import type pptr from 'puppeteer-core'
import type react from 'react'
import type react_dom from 'react-dom/server'
import WebSocket from 'ws'
import type { ParentThread } from '../../builder/src/thread'
import type { BaseWindow } from '../../web/init/src/window'

export type API = {
  id: string
  name: string
  type: 'WS' | 'API'
  url: string
  serverOnLoad: (args: any) => Promise<void>
}

export type Layout = {
  id: string
  name: string
  ssr?: boolean
  jsx?: { raw: string; code: string; map: string }
  serverOnLoad?: (args: any) => Promise<void>
}

export type Page = {
  id: string
  name: string
  jsx?: { raw: string; code: string; map: string }
  url: string
  layout_id: string
  serverOnLoad?: (args: any) => Promise<void>
}

export type Component = {
  name: string
  path: string
  jsx?: { raw: string; code: string; map: string }
}

export interface IPlatformCache {
  layout: Record<string, Layout>
  page: Record<string, Page>
  api: Record<string, API>
  component: Record<string, Component>
  db: {
    api: Database
    page: Database
    component: Database
    layout: Database
  }
  index: string
  figma: {
    bgMaps: Record<string, { raw: any; gz?: any; br?: any }>
    imageMaps: Record<string, { to?: string; raw?: any; gz?: any; br?: any }>
  }
  ssrstamp: Record<string, number>
  public: {
    gz: Record<string, any>
    br: Record<string, any>
    raw: Record<string, any>
  }
}

export interface IPlatformFigma {
  connected: boolean
  ask: {
    lastId: 0
    answers: {}
    callbacks: Record<string, any>
  }
  saving: Record<string, { jsx: string; nodes: string }>
  ws?: WebSocket
  nextId: number
}

export interface PlatformGlobal {
  hostname?: string
  port: number
  mode: 'dev' | 'prod'
  require: any
  requestContext: typeof requestContext
  React: typeof react
  cssLoader: Record<string, true>
  generateIndexHTML?: {
    window: BaseWindow
  }
  ReactDOM: typeof react_dom
  componentList: BaseWindow['cms_components']
  buildPath: {
    bundle: { base: string; session: string }
    upload: string
    public: string
    pkgs: string
  }
  assets: Record<string, string>
  assetStamp: string
  bin: {
    lmdb: typeof lmdb
    msgpackr: typeof msgpackr
    esbuild: typeof esbuild
    pptr: typeof pptr
    prettier: typeof prettier
    sodium: any
  }
  pdf: {
    raw: Record<
      string,
      {
        html: string
        header?: string
        footer?: string
        landscape?: boolean
        margin?: {
          top?: number
          left?: number
          right?: number
          bottom?: number
        }
      }
    >
    gen: Record<string, Buffer>
  }
  pptr?: pptr.Browser
  fetch: typeof fetch
  Headers: typeof Headers
  bundle: {
    base: RootDatabase
    session: RootDatabase
  }
  build: {
    id: string
    secret: Buffer
    tstamp: number
    cms_pages: Record<
      string,
      { id: Page['id']; lid: Page['layout_id']; url: Page['url']; sol: boolean }
    >
    cms_layouts: Record<
      string,
      { id: Layout['id']; name: Layout['name']; source?: string }
    >
  }
  db: typeof db
  dmmf: ThenArg<ReturnType<typeof prismasdk.getDMMF>>
  figma: IPlatformFigma
  cache: IPlatformCache
  pool?: {
    parent: ParentThread
    onMessage: (msg: any) => Promise<void>
    shouldExit: boolean
  }
  dev?: {
    history: BaseHistory
    sync: Watcher
    fallbackSaving: boolean
    broadcast: (msg: { type: string; data?: any }) => void
  }
}
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
declare module 'sodium-universal'
