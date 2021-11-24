import arg from 'arg'
import { dirs } from 'boot'
import { logo } from 'boot/src/utils/logging'
import type { ParentThread } from 'builder/src/thread'
import fetch, { Headers } from 'cross-fetch'
import { ensureDir } from 'fs-extra'
import get from 'lodash.get'
import { join } from 'path'
import { PlatformGlobal } from '../types'
import { fetchBin } from './env-bin'
import { bundleEnv } from './env-bundle'
import { cacheEnv } from './env-cache'
import { setupDbEnv as dbEnv } from './env-db'

declare const global: PlatformGlobal
export const initEnv = async (mode: 'dev' | 'prod', parent?: ParentThread) => {
  const args = arg({
    '--port': Number,
  })

  global.host = 'localhost'
  global.mode = mode
  global.port = args['--port'] || (mode === 'prod' ? 8200 : 3200)

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
        public: join(dirs.build, 'bundle', 'public.bundle'),
        session: join(dirs.build, 'bundle', 'session.bundle'),
      },
      public: join(dirs.pkgs.web, 'public'),
      upload: join(dirs.root, 'uploads'),
      pkgs: join(dirs.build, 'pkgs'),
    }
  } else {
    const root = join(__dirname, '..')
    global.buildPath = {
      bundle: {
        base: join(root, 'bundle', 'base.bundle'),
        public: join(root, 'bundle', 'public.bundle'),
        session: join(root, 'bundle', 'session.bundle'),
      },
      public: join(root, 'public'),
      upload: join(root, 'uploads'),
      pkgs: join(root, 'pkgs'),
    }
  }

  // enseure dir
  await ensureDir(global.buildPath.public)
  await ensureDir(global.buildPath.upload)

  // setup required native bin
  global.bin = await fetchBin()

  // setup secret
  global.build = {
    id: new Date().getTime().toString(),
    secret: null as any,
    tstamp: get(global, 'build.tstamp', new Date().getTime()),
    cms_layout: {},
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

  // log('base', `Environment Initialized`)
}
