import { dirs, log } from 'boot'
import execa from 'execa'
import { pathExists, readJSON, readJsonSync, remove, writeJSON } from 'fs-extra'
import type lmdb from 'lmdb'
import type msgpackr from 'msgpackr'
import type esbuild from 'esbuild'
import type puppeteer from 'puppeteer-core'
import { join } from 'path'
import { PlatformGlobal } from '../types'

declare const global: PlatformGlobal

interface IConfig {
  os: string
  arch: string
  ready: boolean
}

export const fetchBin: () => Promise<{
  sodium: any
  lmdb: typeof lmdb
  esbuild: typeof esbuild
  msgpackr: typeof msgpackr
  pptr: typeof puppeteer
}> = async () => {
  let hasFullPptr = await pathExists(
    join(dirs.root, 'node_modules', 'puppeteer', 'cjs-entry.js')
  )

  if (global.pool) {
    const oldPkg = readDeps(dirs.pkgs.platform)
    const pkgPath = join(global.buildPath.pkgs, 'package.json')
    await writeJSON(pkgPath, {
      name: 'base',
      license: 'ISC',
      dependencies: {
        esbuild: oldPkg['esbuild'],
        prisma: oldPkg['@prisma/sdk'],
        puppeteer: oldPkg['puppeteer-core'],
        msgpackr: oldPkg['msgpackr'],
        '@prisma/sdk': oldPkg['@prisma/sdk'],
        '@prisma/client': oldPkg['@prisma/sdk'],
        'sodium-universal': oldPkg['sodium-universal'],
        lmdb: oldPkg['lmdb'],
      },
    })

    return {
      sodium: require(join(
        dirs.pkgs.platform,
        'node_modules',
        'sodium-universal',
        'index.js'
      )),
      pptr: hasFullPptr
        ? require(join(dirs.root, 'node_modules', 'puppeteer', 'cjs-entry.js'))
        : require(join(
            dirs.pkgs.platform,
            'node_modules',
            'puppeteer-core',
            'cjs-entry.js'
          )),
      lmdb: require(join(
        dirs.pkgs.platform,
        'node_modules',
        'lmdb',
        'index.js'
      )),
      esbuild: require(join(
        dirs.pkgs.platform,
        'node_modules',
        'esbuild',
        'lib',
        'main.js'
      )),
      msgpackr: require(join(
        dirs.pkgs.platform,
        'node_modules',
        'msgpackr',
        'dist',
        'node.cjs'
      )),
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
    sodium: require(join(
      global.buildPath.pkgs,
      'node_modules',
      'sodium-universal',
      'index.js'
    )),
    esbuild: require(join(
      global.buildPath.pkgs,
      'node_modules',
      'esbuild',
      'lib',
      'main.js'
    )),
    pptr: require(join(
      global.buildPath.pkgs,
      'node_modules',
      hasFullPptr ? 'puppeteer' : 'puppeteer-core',
      'cjs-entry.js'
    )),
    lmdb: require(join(
      global.buildPath.pkgs,
      'node_modules',
      'lmdb',
      'index.js'
    )),
    msgpackr: require(join(
      global.buildPath.pkgs,
      'node_modules',
      'msgpackr',
      'dist',
      'node.cjs'
    )),
  }
}

const readDeps = (pkgdir: string) => {
  const pkg = join(pkgdir, 'package.json')
  const json = readJsonSync(pkg)
  return json.dependencies
}
