import { dirs, log } from 'boot'
import { build } from 'esbuild'
import execa from 'execa'
import { lstat, pathExists, remove, stat } from 'fs-extra'
import { ellapsedTime } from 'libs'
import { Database, open, RootDatabase } from 'lmdb'
import { padEnd } from 'lodash'
import { join } from 'path'
import { Worker } from 'worker_threads'
import zlib from 'zlib'
import { MainGlobal } from '../../start'

const itemTypes = ['public'] as const
export type ItemType = typeof itemTypes[number]

declare const global: MainGlobal

export class publicBundle {
  static path = join(dirs.build, 'bundle', 'public.bundle')
  root?: RootDatabase

  items: Record<'raw' | 'br' | 'gz', Record<ItemType, Database>> = {
    raw: {} as any,
    br: {} as any,
    gz: {} as any,
  }

  constructor() {
    this._init()
  }

  async _init() {
    this.root = open({
      path: publicBundle.path,
      compression: true,
      maxDbs: 20,
      noMemInit: true,
      useVersions: false,
    })

    for (let i of itemTypes) {
      for (let [key, item] of Object.entries(this.items)) {
        item[i] = this.root.openDB(`${i}-${key}`, {
          name: `${i}-${key}`,
          compression: true,
          useVersions: false,
        })
      }
    }
  }

  async clear(type: ItemType) {
    if (this.root) {
      for (let key of Object.keys(this.items)) {
        const db = this.items[key][type] as Database
        db.deleteDB()
        this.items[key][type] = this.root.openDB(`${type}-${key}`, {
          name: `${type}-${key}`,
          compression: true,
          useVersions: false,
        })
      }
    }
  }

  async save(type: ItemType, path: string, content: Uint8Array) {
    if (!!path && !!content) {
      await this.items.raw[type].put(path.replace(/\\/gi, '/'), content)
    }
  }

  async compressAll(type: ItemType) {
    return new Promise<void>(async (resolve) => {
      const count = this.items.raw[type].getCount({})
      log(
        'base',
        padEnd(`Compressing ${count} file${count > 1 ? 's' : ''}`, 30, '.'),
        false
      )
      const ms = new Date().getTime()
      const out = join(dirs.pkgs.main, 'node_modules', 'lmdb', '_compress.js')
      // if (!(await pathExists(out))) {
      await build({
        entryPoints: [
          join(
            dirs.pkgs.main,
            'src',
            'bundler',
            'public',
            'public-compress.ts'
          ),
        ],
        outfile: out,
        bundle: true,
        external: ['esbuild', 'lmdb'],
        nodePaths: [join(dirs.root, 'node_modules')],
        platform: 'node',
      })
      // }
      try {
        const child = new Worker(out)
        global.bundleCompressor = child
        child.on('exit', (exitCode) => {
          if (exitCode === 0) {
            resolve()
          }
        })
      } catch (e) {
        console.log(e)
      }
    })
  }

  async compressSingle(type: ItemType, path: string, content: Uint8Array) {
    await Promise.all([
      new Promise<void>((resolve) => {
        zlib.brotliCompress(content, {}, (_, result) => {
          this.items.br[type].put(path, result)
          resolve()
        })
      }),
      new Promise<void>((resolve) => {
        zlib.gzip(content, {}, (_, result) => {
          this.items.gz[type].put(path, result)
          resolve()
        })
      }),
    ])
  }

  async list(type: ItemType, compression: keyof publicBundle['items'] = 'raw') {
    const result: Record<string, any> = {}
    const db = this.items[compression][type]
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
  static _instance: publicBundle
  static get db() {
    if (!publicBundle._instance) publicBundle._instance = new publicBundle()
    return publicBundle._instance
  }
}
