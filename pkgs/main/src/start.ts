import { dirs } from 'boot'
import { BuilderPool } from 'builder'
import { ParentThread } from 'builder/src/thread'
import { BuildResult, Metafile } from 'esbuild'
import { pathExists, readFile, writeFile } from 'fs-extra'
import { join } from 'path'
import { Worker } from 'worker_threads'
import { buildDB } from './start/build-db'
import { buildDev } from './start/build-dev'
import { buildLibs } from './start/build-libs'
import { buildPlatform } from './start/build-platform'
import { buildServer } from './start/build-server'
import { buildWebDev } from './start/build-web-dev'
import { buildWebProd } from './start/build-web-prod'

export interface MainGlobal {
  mode: 'dev' | 'prod'
  parent: ParentThread
  rootstamp: number
  port: number
  platform: {
    ready: boolean
    metafile?: Metafile
  }
  pool: BuilderPool
  devBuild?: BuildResult
  entryPoints: Record<string, string>
  twcwd: string
  twconf: string
  bundleCompressor: Worker
}

declare const global: MainGlobal

const pool = new BuilderPool()
export const stop = async () => {
  if (global.bundleCompressor) {
    global.bundleCompressor.terminate()
  }
  pool.destroy()
}
export const start = async (
  port: number,
  mode: 'dev' | 'prod',
  parent: ParentThread
) => {
  global.rootstamp = new Date().getTime()
  global.pool = pool
  global.port = port
  global.platform = {
    ready: false,
  }

  if (mode === 'dev') {
    const uipath = join(dirs.pkgs.figma, 'bin', 'ui.html')
    if (await pathExists(uipath)) {
      const src = (await readFile(uipath, 'utf-8')).replace(
        '[url]',
        `http://localhost:${port}`
      )
      await writeFile(uipath, src)
    }

    await writeFile(
      join(dirs.pkgs.figma, 'src', 'host.js'),
      `module.exports = 'localhost:${port}';`
    )
  }

  await buildLibs(pool, mode)
  await buildServer(pool, mode)
  await buildDev(pool)
  await buildDB(pool)

  buildPlatform(pool, mode, port)

  if (mode === 'dev') {
    await buildWebDev(pool, mode)
    console.log('')
  }
  if (mode === 'prod') await buildWebProd(pool, mode)

  pool.send('platform', `start|${port}|${global.rootstamp}`)
  pool.onParentMessage(async (msg) => {
    if (msg === 'platform-ready') {
      pool.send('platform', `start|${port}|${global.rootstamp}`)
    }
  })
}
