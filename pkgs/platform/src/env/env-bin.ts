import { dirs, log } from 'boot'
import type esbuild from 'esbuild'
import { execa } from 'execa'
import { pathExists, readJSON, remove, writeJSON } from 'libs/fs'
import type lmdb from 'lmdb'
import type msgpackr from 'msgpackr'
import type prettier from 'prettier'
import { join } from 'path'
import type puppeteer from 'puppeteer-core'
import { PlatformGlobal } from '../types'

declare const global: PlatformGlobal

interface IConfig {
  os: string
  arch: string
  ready: boolean
}

const importLib = async (path: string, sub?: string) => {
  const result = await import(path)
  if (!sub) {
    if (result.default) return result.default
  } else {
    return result[sub]
  }
  return result
}

export const fetchBin: () => Promise<{
  sodium: any
  prettier: typeof prettier
  lmdb: typeof lmdb
  esbuild: typeof esbuild
  msgpackr: typeof msgpackr
  pptr: typeof puppeteer
}> = async () => {
  let hasFullPptr = await pathExists(
    join(dirs.root, 'node_modules', 'puppeteer', 'cjs-entry.js')
  )

  if (global.pool) {
    return {
      prettier: await importLib(
        join(dirs.pkgs.platform, 'node_modules', 'prettier', 'index.js')
      ),
      sodium: await importLib(
        join(dirs.pkgs.platform, 'node_modules', 'sodium-universal', 'index.js')
      ),
      pptr: hasFullPptr
        ? await importLib(
            join(dirs.root, 'node_modules', 'puppeteer', 'cjs-entry.js')
          )
        : await importLib(
            join(
              dirs.pkgs.platform,
              'node_modules',
              'puppeteer-core',
              'cjs-entry.js'
            )
          ),
      lmdb: await importLib(
        join(dirs.pkgs.platform, 'node_modules', 'lmdb', 'node-index.js')
      ),
      esbuild: await importLib(
        join(dirs.pkgs.platform, 'node_modules', 'esbuild', 'lib', 'main.js')
      ),
      msgpackr: await importLib(
        join(dirs.pkgs.platform, 'node_modules', 'msgpackr', 'dist', 'node.cjs')
      ),
    }
  }

  let installBin = true

  const configPath = join(global.buildPath.pkgs, 'config.json')
  const config: IConfig = {
    os: process.platform,
    arch: process.arch,
    ready: false,
  }
  if (!(await pathExists(configPath))) {
    await writeJSON(configPath, config)
  } else {
    const oldConfig = (await readJSON(configPath)) as IConfig
    if (
      oldConfig.ready &&
      (await pathExists(join(global.buildPath.pkgs, 'node_modules')))
    ) {
      config.ready = true
    }
    if (oldConfig.os === config.os && oldConfig.arch === config.arch) {
      installBin = false
    }
    if (!config.ready) {
      installBin = true
    }
  }

  if (installBin) {
    if (await pathExists(join(global.buildPath.pkgs, 'node_modules'))) {
      await remove(join(global.buildPath.pkgs, 'node_modules'))
    }

    log('boot', 'Installing packages', false)
    await execa('npm', ['i'], {
      cwd: global.buildPath.pkgs,
    })

    config.ready = true
    await writeJSON(configPath, config)
    process.stdout.write(' [DONE]\n')
  }

  hasFullPptr = await pathExists(
    join(dirs.root, 'pkgs', 'node_modules', 'puppeteer', 'cjs-entry.js')
  )

  return {
    prettier: await importLib(
      join(
        global.buildPath.pkgs,
        'node_modules',
        'prettier',
        'index.js'
      )
    ),
    sodium: await importLib(
      join(
        global.buildPath.pkgs,
        'node_modules',
        'sodium-universal',
        'index.js'
      )
    ),
    esbuild: await importLib(
      join(global.buildPath.pkgs, 'node_modules', 'esbuild', 'lib', 'main.js')
    ),
    pptr: await importLib(
      join(
        global.buildPath.pkgs,
        'node_modules',
        hasFullPptr ? 'puppeteer' : 'puppeteer-core',
        'cjs-entry.js'
      )
    ),
    lmdb: await importLib(
      join(global.buildPath.pkgs, 'node_modules', 'lmdb', 'node-index.js')
    ),
    msgpackr: await importLib(
      join(
        global.buildPath.pkgs,
        'node_modules',
        'msgpackr',
        'dist',
        'node.cjs'
      )
    ),
  }
}
