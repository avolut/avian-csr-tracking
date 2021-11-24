import { dirs } from 'boot'
import { join } from 'path'
import { Database, open, RootDatabase } from 'lmdb'

import { Page, API, Layout, Component } from 'platform/src/types'
import { pathExists, remove } from 'fs-extra'

export const baseDir = {
  layout: join(dirs.app.web, 'src', 'base', 'layout'),
  page: join(dirs.app.web, 'src', 'base', 'page'),
  api: join(dirs.app.web, 'src', 'base', 'api'),
  component: join(dirs.app.web, 'src', 'components'),
}

export const rowTypes = ['map', 'raw', 'code', 'info', 'jsx', 'api'] as const
export type rowType = typeof rowTypes[number]

export const baseTypes = ['page', 'component', 'api', 'layout'] as const
export type baseType = typeof baseTypes[number]

export class baseBundle {
  static path = join(dirs.build, 'bundle', 'base.bundle')
  root?: RootDatabase
  items: Record<baseType, Database> = {
    page: null as any,
    component: null as any,
    api: null as any,
    layout: null as any,
  }

  constructor() {
    this._init()
  }

  reconnect() {
    this.items.api.close()
    this.items.page.close()
    this.items.component.close()
    this.items.layout.close()
    this.root?.close()
    this._init()
  }

  _init() {
    this.root = open({
      path: baseBundle.path,
      compression: true,
      maxDbs: 5,
      noMemInit: true,
      useVersions: false,
    })
    for (let type of Object.keys(this.items)) {
      this.items[type] = this.root.openDB(`${type}`, {
        compression: true,
        useVersions: false,
      })
    }
  }

  async clear(type: baseType) {
    if (this.root) {
      for (let [_, item] of Object.entries(this.items)) {
        item.deleteDB()
        item = this.root.openDB(`${type}`, {
          compression: true,
          useVersions: false,
        })
      }
    }
  }

  exists(type: baseType, key: string) {
    return this.items[type].doesExist(key)
  }

  async delete(type: baseType, key: string) {
    for (let rowType of rowTypes) {
      await this.items[type].remove(`${key}|${rowType}`)
    }
  }

  async save(type: baseType, key: string, content: Uint8Array | string) {
    if (!!key && !!content) {
      if (!this.items[type].doesExist(key)) {
        await this.items[type].put(key, content)
        return true
      }
    }
    return false
  }

  async list(type: baseType) {
    const result: Record<string, any> = {}
    const db = this.items[type]
    if (db) {
      for (let key of db.getKeys({})) {
        if (typeof key === 'string') {
          result[key] = db.getEntry(key)
        }
      }
    }
    return result
  }

  // singleton
  static _instance: baseBundle
  static get db() {
    if (!baseBundle._instance) baseBundle._instance = new baseBundle()
    return baseBundle._instance
  }
}
