import { dirs, log } from 'boot'
import { BuilderPool } from 'builder'
import { OutputFile } from 'esbuild'
import execa from 'execa'
import { copy, ensureDir } from 'fs-extra'
import klaw from 'klaw'
import {
  copyFile,
  pathExists,
  readFile,
  readJSON,
  remove,
  writeFile
} from 'libs/fs'
import { dirname, join } from 'path'
import { aliasLoader } from 'src/utils/aliasLoader'
import { cssLoader } from 'src/utils/cssLoader'
import { MainGlobal } from '../start'
import { webFiles, webPkgs } from '../utils/devFiles'
import { ensureProject } from '../utils/ensureProject'
import { overrideWebIndex } from '../utils/overrideWebIndex'
import { runPnpm } from '../utils/pnpm'
import { baseTypeFiles } from './build-dev'

declare const global: MainGlobal

export const buildWeb = async (pool: BuilderPool, mode: 'dev' | 'prod') => {
  return new Promise<void>(async (resolve) => {
    if (!(await pathExists(join(dirs.app.web, 'disabled')))) {
      let existingCss = ''
      if (await pathExists(join(dirs.build, 'public', 'index.css'))) {
        existingCss = await readFile(
          join(dirs.build, 'public', 'index.css'),
          'utf-8'
        )
      }

      await remove(join(dirs.build, 'public'))
      await ensureDir(join(dirs.build, 'public'))

      if (existingCss) {
        await writeFile(join(dirs.build, 'public', 'index.css'), existingCss)
      }

      if (
        await ensureProject('web-app', dirs.app.web, {
          files: webFiles,
          pkgs: webPkgs,
        })
      ) {
        await runPnpm('install')
      }

      if (await pathExists(join(dirs.app.web, 'build', 'deps.json'))) {
        await readJSON(join(dirs.app.web, 'build', 'deps.json'))
      }

      await runPkgsTailwind()
      runTailwind()
      let reloading = false

      const ins = [join(dirs.app.web, 'src', 'index.tsx')]
      await pool.add('web', {
        root: dirs.app.web,
        platform: 'browser',
        in: ins,
        buildOptions: {
          incremental: true,
          chunkNames: 'chunks/[name]-[hash]',
          minify: true,
          bundle: true,
          legalComments: 'none',
          sourcemap: mode === 'dev',
          treeShaking: true,
          splitting: true,
          keepNames: true,
          metafile: true,
          write: false,
          define: {
            'process.env.NODE_ENV':
              mode === 'prod' ? `"production"` : `"development"`,
          },
          outdir: join(dirs.build, 'public'),
          external: [
            '@emotion/react',
            'stream',
            'util',
            'zlib',
            'worker_threads',
            'crypto',
          ],
          format: 'esm',
          target: 'esnext',
        },
        plugins: [
          aliasLoader({
            from: /\@emotion\/react/,
            to: join(
              dirs.pkgs.web,
              'init',
              'node_modules',
              '@emotion/react',
              'dist',
              'emotion-react.umd.min.js'
            ),
          }),
          cssLoader(),
        ],
        onChange: async (ev, path, builder) => {
          if (baseTypeFiles.indexOf(join(dirs.root, path)) >= 0) {
            return
          }
          log('refresh', `🏗️  ${path} `, false)
          try {
            await pool.rebuild('web')
            reloading = true
          } catch (e) {
            process.stdout.write(` [FAILED]\n${e}\n\n`)
          }
        },
        onBuilt: async (result) => {
          await overrideWebIndex(mode)
          await ensureDir(join(dirs.build, 'public'))
          await writeFile(
            join(dirs.build, 'public', 'build.timestamp'),
            new Date().getTime().toString()
          )

          if (result.outputFiles) {
            const outputFiles: OutputFile[] = Object.values(result.outputFiles)

            // app/web/build
            await Promise.all(
              outputFiles.map(async (item) => {
                if (item.path === join(dirs.build, 'public', 'index.css'))
                  return
                await ensureDir(dirname(item.path))
                return await writeFile(item.path, item.contents)
              })
            )

            if (reloading) {
              pool.send('platform', `reload|all|public`)
            }
          }

          if (mode === 'prod') {
            await new Promise((resolve) => {
              klaw(join(dirs.app.web, 'public'))
                .on('data', async (item) => {
                  if (!item.stats.isFile()) return
                  const to = item.path.substring(
                    join(dirs.app.web, 'public').length
                  )
                  if (!(await pathExists(join(dirs.build, 'public', to)))) {
                    await ensureDir(dirname(join(dirs.build, 'public', to)))
                    copyFile(item.path, join(dirs.build, 'public', to))
                  }
                })
                .on('end', resolve)
            })

            await copy(
              join(dirs.app.web, 'figma', 'imgs'),
              join(dirs.build, 'public', 'fimgs')
            )

            await copy(
              join(dirs.pkgs.web, 'ext'),
              join(dirs.build, 'public', '__ext')
            )
          }

          resolve()
        },
      })
    }
  })
}

function formatBytes(bytes: number, decimals?: number) {
  if (bytes == 0) return '0 Bytes'
  var k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const runPkgsTailwind = async () => {
  if (global.mode === 'dev') {
    let opts = [
      '--watch',
      '--jit',
      '-v',
      '-i',
      join(dirs.pkgs.web, 'tailwind', 'tailwind.rule.css'),
      '-o',
      join(dirs.pkgs.web, 'tailwind', 'tailwind.built.css'),
    ]
    execa(join(dirs.pkgs.main, 'node_modules', '.bin', 'tailwindcss'), opts, {
      cwd: join(dirs.pkgs.web),
    })
  } else {
    let opts = [
      '-v',
      '-c',
      join(dirs.pkgs.web, 'tailwind', 'tailwind.config.cjs'),
      '-i',
      join(dirs.pkgs.web, 'tailwind', 'tailwind.rule.css'),
      '-o',
      join(dirs.pkgs.web, 'tailwind', 'tailwind.built.css'),
    ]
    await execa(
      join(dirs.pkgs.main, 'node_modules', '.bin', 'tailwindcss'),
      opts,
      {
        cwd: join(dirs.pkgs.web),
      }
    )
  }
}

const runTailwind = () => {
  return new Promise<void>(async (resolve) => {
    if (!global.tw) {
      let opts = [
        '--watch',
        '--jit',
        '--minify',
        '-v',
        '-i',
        join(dirs.app.web, 'src', 'index.css'),
        '-o',
        join(dirs.build, 'public', 'index.css'),
      ]
      if (global.mode === 'prod')
        opts = [
          '--minify',
          '-v',
          '-i',
          join(dirs.app.web, 'src', 'index.css'),
          '-o',
          join(dirs.build, 'public', 'index.css'),
        ]
      global.tw = {
        built: false,
        process: execa(
          join(dirs.pkgs.main, 'node_modules', '.bin', 'tailwindcss'),
          opts,
          {
            cwd: join(dirs.app.web),
          }
        ),
      }
      if (global.tw) global.tw.built = true
      resolve()
    } else {
      resolve()
    }
  })
}
