import arg from 'arg'
import { dirs } from 'boot'
import { logo } from 'boot/src/utils/logging'
import fetch, { Headers } from 'cross-fetch'
import { ensureDir } from 'libs/fs'
import get from 'lodash.get'
import { dirname, join } from 'path'
import type { ParentThread } from '../../../builder/src/thread'
import { PlatformGlobal } from '../types'
import { fetchBin } from './env-bin'
import { bundleEnv } from './env-bundle'
import { cacheEnv, reloadAsset } from './env-cache'
import { setupDbEnv as dbEnv } from './env-db'
import { prodEnv } from './env-prod'

declare const global: PlatformGlobal
export const initEnv = async (mode: 'dev' | 'prod', parent?: ParentThread) => {
  const args = arg({
    '--port': Number,
  })

  global.mode = mode
  if (!parent) global.port = args['--port'] || 3200

  // setup parent pool - for dev
  if (parent) {
    global.pool = {
      onMessage: async (msg: any) => {},
      parent,
      shouldExit: false,
    }
  }

  if (!global.pool) {
    console.log(`${logo()} Production [port: ${global.port}]`)
  }

  // setup fetch
  global.fetch = fetch
  global.Headers = Headers

  // setup dirs
  if (global.pool) {
    global.buildPath = {
      bundle: {
        base: join(dirs.build, 'bundle', 'base.bundle'),
        session: join(dirs.build, 'bundle', 'session.bundle'),
      },
      public: join(dirs.build, 'public'),
      upload: join(dirs.root, 'uploads'),
      pkgs: join(dirs.build, 'pkgs'),
    }
  } else {
    const root = join(dirname(import.meta.url), '..')
    global.buildPath = {
      bundle: {
        base: join(root, 'bundle', 'base.bundle'),
        session: join(root, 'bundle', 'session.bundle'),
      },
      public: join(root, 'public'),
      upload: join(root, 'uploads'),
      pkgs: join(root, 'pkgs'),
    }
  }

  // ensure dir
  await ensureDir(global.buildPath.public)
  await ensureDir(global.buildPath.upload)

  await reloadAsset()

  // setup required native bin
  global.bin = await fetchBin()

  global.componentList = {}

  // setup secret
  global.build = {
    id: new Date().getTime().toString(),
    secret: null as any,
    tstamp: get(global, 'build.tstamp', new Date().getTime()),
    cms_layouts: {},
    cms_pages: {},
  }

  global.build.secret = global.bin.sodium.sodium_malloc(
    global.bin.sodium.crypto_secretbox_KEYBYTES
  )

  global.bin.sodium.randombytes_buf(global.build.secret)

  // setup bundle
  await bundleEnv()

  // setup db
  await dbEnv()

  // setup figma
  if (global.mode === 'dev') {
    global.figma = {
      ask: {
        lastId: 0,
        answers: {},
        callbacks: {},
      },
      connected: false,
      nextId: 0,
      saving: {},
    }
  }

  // load cache
  await cacheEnv()

  if (global.mode === 'prod') {
    await prodEnv()
  }

}
