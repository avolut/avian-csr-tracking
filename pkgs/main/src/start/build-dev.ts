import { clearScreen, dirs, log } from 'boot'
import { BuilderPool, Watcher } from 'builder'
import {
  ensureDir,
  lstat,
  pathExists,
  readdir,
  readFile,
  readJSON,
  remove,
} from 'fs-extra'
import { basename, dirname, join } from 'path'
import { compileSingleComponent } from 'src/bundler/base/comp-compiler'
import { compileSinglePage } from 'src/bundler/base/page-compiler'
import { prepLayoutJsx, prepPageJsx } from 'src/bundler/base/page-reload'
import { MainGlobal } from 'src/start'
import { checkBaseType } from '../../../dev/src/base-type/checkBaseType'
import { genTypeExternal } from '../../../dev/src/base-type/genTypeExternal'
import { genTypeGlobal } from '../../../dev/src/base-type/genTypeGlobal'
import { baseDir } from '../../../dev/src/migrate/toV1/parse-jsx'
import { startMigration } from '../../../dev/src/migrate/toV1/start-migrate'
import { upgradeComponentsToV1 } from '../../../dev/src/migrate/toV1/upgrade-component'
import { startMigrationV2 } from '../../../dev/src/migrate/toV2/start-migrate'
import { upgradeComponentsToV2 } from '../../../dev/src/migrate/toV2/upgrade-components'
import { baseBundle, baseType, baseTypes } from '../bundler/base/base'
import { getExternalImportMap } from '../bundler/base/comp-info'

declare const global: MainGlobal

export const baseTypeFiles = [
  join(dirs.app.web, 'src', 'external.tsx'),
  join(dirs.app.web, 'src', 'global.ts'),
]

export const buildDev = async (pool: BuilderPool) => {
  process.stdout.write(' • Dev')

  let externals: Record<string, string> = {}
  if (
    (await pathExists(baseBundle.path)) &&
    (await lstat(baseBundle.path)).size > 50 * 1000 * 1024
  ) {
    await remove(baseBundle.path)
  }

  if (await checkBaseType()) {
    await genTypeExternal()
    await genTypeGlobal()
  }

  pool.watchers[`base-types`] = new Watcher(baseTypeFiles, async (e, file) => {
    if (file.endsWith('external.tsx')) {
      await genTypeExternal()
      for (let i of Object.keys(externals)) {
        delete externals[i]
      }
      for (let [k, v] of Object.entries(await getExternalImportMap())) {
        externals[k] = v
      }
    } else if (file.endsWith('global.ts')) {
      await genTypeGlobal()
    }
  })

  pool.watchers[`base-components`] = new Watcher(
    [join(dirs.app.web, 'src', 'components')],
    async (_, file) => {
      if (file.endsWith('.base.tsx')) {
        if (Object.keys(externals).length === 0) {
          for (let [k, v] of Object.entries(await getExternalImportMap())) {
            externals[k] = v
          }
        }
        log('refresh', `🚚 ${file.substring(dirs.root.length + 1)}`, false)
        const compName = await loadSingleComp(
          file.substring(join(dirs.app.web, 'src', 'components').length + 1),
          externals,
          true
        )
        if (compName) {
          process.stdout.write(' [DONE]\n')
          pool.send('platform', `reload|comp|${compName}`)
        } else {
          process.stdout.write(' [CANCELED]\n')
          log(
            'warning',
            '🚧 WARN: Component does not exists on app/web/src/external.tsx'
          )
        }
      }
    }
  )

  let migrating = false
  if (await pathExists(join(dirs.app.web, 'cms'))) {
    try {
      migrating = true
      console.log('')
      await startMigration()
      await remove(join(dirs.app.web, 'cms'))
    } catch (e) {
      console.log(e)
    }
  }

  const oldJsx = {
    page: (await readdir(baseDir.page)).filter((e) => {
      return e.endsWith('.jsx')
    }),
    layout: (await readdir(baseDir.layout)).filter((e) => {
      return e.endsWith('.jsx')
    }),
  }

  if (oldJsx.page.length > 0 || oldJsx.layout.length > 0) {
    if (!migrating) {
      console.log('')
    }
    await startMigrationV2(oldJsx)
  }
  const compDir = join(dirs.app.web, 'src', 'components')

  if (migrating) {
    let compFiles = await readdir(compDir)
    compFiles = await upgradeComponentsToV1({ compFiles, migrating, compDir })
  }

  let compFiles = await readdir(compDir)

  if (compFiles.filter((e) => e.endsWith('.jsx')).length > 0) {
    const externals = await getExternalImportMap()
    compFiles = await upgradeComponentsToV2({
      compFiles,
      migrating,
      compDir,
      externals,
    })
  }

  await pool.add('dev', {
    root: dirs.pkgs.dev,
    in: join(dirs.pkgs.dev, 'src', 'index.tsx'),
    out: join(dirs.pkgs.dev, 'build', 'index.js'),
    onChange: async (event, path) => {
      global.rootstamp = new Date().getTime()
      await pool.rebuild('dev')
      clearScreen()
      log('boot', 'Development • Restarting Web Server')
      await pool.rebuild('platform')
      pool.send('platform', `start|${global.rootstamp}`)
    },
  })

  const loadAll: Promise<void>[] = []

  // load layouts, apis, pages
  for (let rawType of baseTypes) {
    const type = rawType as baseType
    if (type === 'component') continue

    const path = join(dirs.app.web, 'src', 'base', type)
    if (await pathExists(path)) {
      const listFiles = await readdir(path)
      for (let file of listFiles) {
        loadAll.push(loadSingleFile(type, file))
      }

      pool.watchers[`${type}-dev`] = new Watcher(
        [join(dirs.app.web, 'src', 'base', type)],
        async (e, file) => {
          try {
            log('refresh', `🚧 ${file.substring(dirs.root.length + 1)}`, false)
            await baseBundle.db.delete(type, basename(file).substring(0, 5))
            await loadSingleFile(type, basename(file))
            pool.send('platform', `reload|${type}|${file}`)
          } catch (e) {
            console.error(e)
          }
        }
      )
    }
  }

  // load components
  loadAll.push(loadAllComponents(externals))
  await Promise.all(loadAll)
}

const loadAllComponents = async (externals: Record<string, string>) => {
  if (Object.keys(externals).length === 0) {
    for (let [k, v] of Object.entries(await getExternalImportMap())) {
      externals[k] = v
    }
  }
  const compDir = join(dirs.app.web, 'src', 'components')
  await ensureDir(compDir)
  let compFiles = await readdir(compDir)

  const compList = compFiles
    .map((i) => {
      if (i.endsWith('.html')) {
        return i.substr(0, i.length - 5) + '.base.tsx'
      }
      return i
    })
    .filter((e) => e.endsWith('.base.tsx'))

  const compLoad: Promise<any>[] = []
  for (let [_, p] of Object.entries(compList)) {
    compLoad.push(loadSingleComp(p, externals))
  }
}

const loadSingleComp = async (
  p: string,
  externals: Record<string, string>,
  force?: true
) => {
  const compDir = join(dirs.app.web, 'src', 'components')
  return new Promise<false | string>(async (resolve) => {
    const fullPath = join(compDir, p)
    const fileCompName = p.substring(0, p.length - '.base.tsx'.length)
    const realCompName = externals[`./components/${fileCompName}`]

    if (realCompName) {
      if (force || !baseBundle.db.exists('component', `${realCompName}|raw`)) {
        const source = await readFile(fullPath)

        if (force) {
          await baseBundle.db.delete('component', `${realCompName}`)
        }
        await Promise.all([
          await baseBundle.db.save('component', `${realCompName}|raw`, source),
          new Promise<void>(async (resolve) => {
            const result = await compileSingleComponent(
              realCompName,
              source.toString('utf-8')
            )

            await Promise.all([
              await baseBundle.db.save(
                'component',
                `${realCompName}|code`,
                result.code
              ),
              await baseBundle.db.save(
                'component',
                `${realCompName}|map`,
                result.map
              ),
            ])
            resolve()
          }),
          await baseBundle.db.save(
            'component',
            `${realCompName}|info`,
            JSON.stringify({
              name: realCompName,
              path: `./components/${fileCompName}`,
            })
          ),
        ])
      }
      resolve(realCompName)
      return
    }
    resolve(false)
  })
}

const loadSingleFile = async (type: baseType, file: string) => {
  const shortPath = `app/web/src/base/${type}/${file}`
  const fullPath = join(dirs.app.web, 'src', 'base', type, file)
  const id = file.substr(0, 5)

  let info = null as any

  if (
    file.endsWith('.base.tsx') ||
    (type === 'api' && file.endsWith('.json'))
  ) {
    if (!baseBundle.db.exists(type, `${id}|info`)) {
      const jsonPath = join(dirname(fullPath), `${id}.json`)
      info = await readJSON(jsonPath)

      try {
        await baseBundle.db.save(type, `${id}|info`, JSON.stringify(info))
      } catch (e) {
        console.log('')
        log('error', `Failed to parse ${shortPath}`)
      }
    }
  }

  if (file.endsWith('.base.tsx')) {
    if (info && !baseBundle.db.exists(type, `${id}|jsx`)) {
      try {
        const source = await readFile(fullPath)
        if (await baseBundle.db.save(type, `${id}|jsx`, source)) {
          let jsx = null as any
          if (type === 'page') {
            jsx = prepPageJsx(info, source.toString('utf-8'))
          }
          if (type === 'layout') {
            jsx = prepLayoutJsx(info, source.toString('utf-8'))
          }

          if (jsx) {
            const compiled = await compileSinglePage(info.id, jsx, type)
            if (compiled) {
              await baseBundle.db.save(type, `${id}|code`, compiled.code)
              await baseBundle.db.save(type, `${id}|map`, compiled.map)
              await baseBundle.db.save(type, `${id}|raw`, compiled.raw)
            }
          }
        }
      } catch (e) {
        console.log('')
        log('error', `Failed to save ${shortPath}: ${e}`)
      }
    }
  } else if (file.endsWith('_api.ts')) {
    if (!baseBundle.db.exists(type, `${id}|api`)) {
      try {
        await baseBundle.db.save(type, `${id}|api`, await readFile(fullPath))
      } catch (e) {
        console.log('')
        log('error', `Failed to save ${shortPath}`)
      }
    }
  }
}
