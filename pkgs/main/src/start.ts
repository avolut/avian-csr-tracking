import { dirs, log, timelog } from 'boot'
import { BuilderPool, ParentThread } from 'builder'
import { BuildResult, Metafile } from 'esbuild'
import { ExecaChildProcess } from 'execa'
import { waitUntil } from 'libs'
import { pathExists, readFile, writeFile, remove } from 'libs/fs'
import { join } from 'path'
import { Worker } from 'worker_threads'
import { buildDB } from './start/build-db'
import { buildDev } from './start/build-dev'
import { buildDocs } from './start/build-docs'
import { buildPlatform } from './start/build-platform'
import { buildServer } from './start/build-server'
import { buildWeb } from './start/build-web'
export interface MainGlobal {
  mode: 'dev' | 'prod'
  parent: ParentThread
  rootstamp: number
  port: number
  platform: {
    ready: boolean
    metafile?: Metafile
  }
  buildDocs: boolean
  tw?: { process: ExecaChildProcess; built: boolean }
  pool: BuilderPool
  devBuild?: BuildResult
  rebuildPlatformOnChange?: boolean
  entryPoints: Record<string, string>
  bundleCompressor: Worker
}

declare const global: MainGlobal

const pool = new BuilderPool()
export const stop = async () => {
  try {
    if (global.bundleCompressor) {
      global.bundleCompressor.terminate()
    }
    if (global.tw?.process) {
      global.tw.process.kill()
    }
    pool.destroy()
  } catch (e) {}
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
  let done = timelog('boot', 'Building server')
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
  } else {
    await remove(join(dirs.build))
  }
  await buildServer(pool, mode)
  done()

  done = timelog('boot', 'Building App')
  await buildDev(pool)
  done()

  done = timelog('boot', 'Building DB')
  await buildDB(pool)
  done()

  if (global.buildDocs) {
    done = timelog('boot', 'Building Docs')
    await buildDocs(pool, mode)
    done()
  }

  done = timelog('boot', 'Building Static Web')
  buildPlatform(pool, mode, port)
  await buildWeb(pool, mode)
  done()

  done = timelog('boot', 'Starting Server')
  if (mode === 'prod') {
    await waitUntil(() => global.tw && global.tw.built)
  }

  let started = false

  pool.send('platform', `start|${port}|${global.rootstamp}`)
  pool.onParentMessage(async (msg) => {
    if (msg === 'platform-ready') {
      pool.send('platform', `start|${port}|${global.rootstamp}`)
      global.rebuildPlatformOnChange = true
      if (!started) {
        started = true
        done(false)
      }
    }
  })
}
