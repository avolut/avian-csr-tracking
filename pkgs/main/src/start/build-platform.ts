import { dirs, log } from 'boot'
import { BuilderPool } from 'builder'
import { readFile, readJsonSync, writeFile, writeJSON } from 'libs/fs'
import { join } from 'path'
import { baseBundle } from 'src/bundler/base/base'
import { welcomeToBase } from '../../../boot/src/utils/logging'
import { MainGlobal } from '../start'
declare const global: MainGlobal

export const buildPlatform = async (
  pool: BuilderPool,
  mode: 'dev' | 'prod',
  port: number
) => {

  global.rebuildPlatformOnChange = false
  await pool.add('platform', {
    root: dirs.pkgs.platform,
    in: join(dirs.pkgs.platform, 'src', 'index.ts'),
    out: join(dirs.root, 'build', 'pkgs', 'platform.js'),
    watch: [join(dirs.pkgs.platform, 'src')],
    onChange: async (type, file) => {
      if (global.rebuildPlatformOnChange) {
        welcomeToBase(mode, port)
        log('boot', 'Restarting Web Server', false)
        global.rootstamp = new Date().getTime()
        await pool.rebuild('platform')
      }
    },
    buildOptions: {
      bundle: true,
      platform: 'node',
      format: 'esm',
      legalComments: 'none',
      target: 'node' + process.versions.node,
      define: {
        'process.env.NODE_ENV':
          mode === 'prod' ? `"production"` : `"development"`,
      },
      external: [
        'sodium-universal',
        'lmdb',
        'prisma',
        'puppeteer-core',
        'fs-extra',
        'esbuild',
        'react',
      ],
      plugins: [
        {
          name: 'ext-server-loader',
          setup: async (build) => {
            build.onResolve({ filter: /^react$/ }, (args) => {
              return { path: 'loadReact', namespace: 'loadReact' }
            })

            build.onLoad(
              { filter: /^loadReact$/, namespace: 'loadReact' },
              () => {
                return {
                  contents: `
                  module.exports = global.React;
                  `,
                }
              }
            )
            build.onResolve({ filter: /^server$/ }, (args) => {
              return {
                path: join(dirs.app.server, 'build', 'index.js'),
              }
            })
          },
        },
      ],
    },
    onBuilt: async () => {
      const oldPkg = readDeps(dirs.pkgs.platform)
      const libsPkg = readDeps(dirs.pkgs.libs)
      const pkgPath = join(dirs.build, 'pkgs', 'package.json')
      await writeJSON(
        pkgPath,
        {
          name: 'base-build',
          license: 'ISC',
          type: 'module',
          private: true,
          dependencies: {
            'fs-extra': libsPkg['fs-extra'],
            esbuild: oldPkg['esbuild'],
            prisma: oldPkg['@prisma/sdk'],
            msgpackr: oldPkg['msgpackr'],
            'puppeteer-core': oldPkg['puppeteer-core'],
            '@prisma/sdk': oldPkg['@prisma/sdk'],
            '@prisma/client': oldPkg['@prisma/sdk'],
            'sodium-universal': oldPkg['sodium-universal'],
            lmdb: oldPkg['lmdb'],
          },
        },
        {
          spaces: 2,
        }
      )

      const source = await readFile(
        join(dirs.build, 'pkgs', 'platform.js'),
        'utf-8'
      )

      if (!source.startsWith(`import { createRequire } from 'module'`)) {
        await writeFile(
          join(dirs.build, 'pkgs', 'platform.js'),
          `\
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
      ${source}`
        )
      }

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
    `await import("./pkgs/platform.js")`
  )
}

const readDeps = (pkgdir: string) => {
  const pkg = join(pkgdir, 'package.json')
  const json = readJsonSync(pkg)
  return json.dependencies
}
