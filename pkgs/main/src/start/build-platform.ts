import { dirs, log } from 'boot'
import { BuilderPool } from 'builder'
import { pathExists, readJSON, writeFile, writeJSON } from 'fs-extra'
import { join } from 'path'
import { baseBundle } from 'src/bundler/base/base'
import { aliasLoader } from 'src/utils/aliasLoader'
import { welcomeToBase } from '../../../boot/src/utils/logging'
import { MainGlobal } from '../start'
import { ensureMain } from '../utils/ensureMain'
declare const global: MainGlobal

export const buildPlatform = async (
  pool: BuilderPool,
  mode: 'dev' | 'prod',
  port: number
) => {
  process.stdout.write(' • Platform')

  const appDeps = {
    db: '1.0.0',
    server: '1.0.0',
  }

  if (
    (await pathExists(join(dirs.root, 'app'))) &&
    (await pathExists(join(dirs.pkgs.platform, 'package.json')))
  ) {
    const pkgPath = join(dirs.pkgs.platform, 'package.json')
    const json = await readJSON(pkgPath)
    let shouldWrite = false
    for (const [k, v] of Object.entries(appDeps)) {
      if (!json.dependencies[k]) {
        json.dependencies[k] = v
        shouldWrite = true
      }
    }

    if (shouldWrite) {
      await writeJSON(pkgPath, json, {
        spaces: 2,
      })
    }
  }

  await pool.add('platform', {
    root: dirs.pkgs.platform,
    in: join(dirs.pkgs.platform, 'src', 'index.ts'),
    out: join(dirs.root, 'build', 'pkgs', 'platform.js'),
    buildOptions: {
      external: [
        'sodium-universal',
        'lmdb',
        'prisma',
        'puppeteer',
        'dev',
        join(dirs.pkgs.dev, 'build', 'index.js'),
      ],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      legalComments: 'none',
      plugins: [
        {
          name: 'ext-server-loader',
          setup: async (build) => {
            build.onResolve({ filter: /^server$/ }, (args) => {
              return {
                path: join(dirs.app.server, 'build', 'index.js'),
              }
            })
          },
        },
      ],
      nodePaths: [
        join(dirs.build, 'pkgs', 'node_modules'),
        join(dirs.root, 'node_modules'),
      ],
      target: 'node' + process.versions.node,
    },
    onChange: async (path) => {
      welcomeToBase(mode, port)
      log('boot', 'Restarting Web Server')
      global.rootstamp = new Date().getTime()
      await pool.rebuild('platform')
    },
    onBuilt: async () => {
      await ensureMain(dirs.pkgs.platform)
      pool.run('platform', {
        mode: global.mode,
        port: global.port,
        rootstamp: global.rootstamp,
      })
      baseBundle.db.reconnect()
    },
  })

  await writeFile(
    join(dirs.root, 'build', 'base.js'),
    `require("./pkgs/platform.js")`
  )
}
