import type prismasdk from '@prisma/sdk'
import type { ParentThread } from '../../builder/src/thread'
import { db } from 'db'
import type { BaseHistory } from 'dev/src/base/history'
import type lmdb, { Database, RootDatabase } from 'lmdb'
import type msgpackr from 'msgpackr'
import type esbuild from 'esbuild'
import type pptr from 'puppeteer-core'
import WebSocket from 'ws'
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
  public: {
    gz: Database
    br: Database
    raw: Database
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
  host: string
  port: number
  mode: 'dev' | 'prod'
  buildPath: {
    bundle: { base: string; public: string; session: string }
    upload: string
    public: string
    pkgs: string
  }
  bin: {
    lmdb: typeof lmdb
    msgpackr: typeof msgpackr
    esbuild: typeof esbuild
    pptr: typeof pptr
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
    public: RootDatabase
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
    cms_layout: Record<
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
