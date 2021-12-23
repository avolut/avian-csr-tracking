import { dirs, log } from 'boot'
import { BuilderPool } from 'builder'
import execa from 'execa'
import { ensureDir } from 'fs-extra'
import {
  copy,
  pathExists,
  readFile,
  readJSON,
  remove,
  writeFile,
} from 'libs/fs'
import { join } from 'path'
import { aliasLoader } from 'src/utils/aliasLoader'
import { cssLoader } from 'src/utils/cssLoader'
import { Writable } from 'stream'
import { MainGlobal } from '../start'
import { baseTypeFiles } from './build-dev'

declare const global: MainGlobal

export const buildDocs = async (pool: BuilderPool, mode: 'dev' | 'prod') => {
  return new Promise<void>(async (resolve) => {
    if (!(await pathExists(join(dirs.pkgs.docs, 'disabled')))) {
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

      if (await pathExists(join(dirs.pkgs.docs, 'build', 'deps.json'))) {
        await readJSON(join(dirs.pkgs.docs, 'build', 'deps.json'))
      }

      runTailwind()
      let reloading = false

      const ins = [join(dirs.pkgs.docs, 'src', 'index.tsx')]
      await pool.add('docs', {
        root: dirs.pkgs.docs,
        platform: 'browser',
        in: ins,
        buildOptions: {
          incremental: true,
          chunkNames: 'chunks/[name]-[hash]',
          minify: false,
          bundle: true,
          legalComments: 'none',
          sourcemap: mode === 'dev',
          treeShaking: true,
          splitting: true,
          keepNames: true,
          metafile: true,
          write: false,
          define: {
            'process.env.NODE_ENV': '"production"',
          },
          outdir: join(dirs.pkgs.docs, 'public'),
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
            await pool.rebuild('docs')
            reloading = true
          } catch (e) {
            process.stdout.write(` [FAILED]\n${e}\n\n`)
          }
        },
        onBuilt: async (result) => {
          await copy(
            join(dirs.pkgs.docs, 'src', 'index.html'),
            join(dirs.pkgs.docs, 'public', 'index.html')
          )
          if (reloading) {
            console.log(' [DONE]\n')
            return
          }
          resolve()
        },
      })
    }
  })
}
const runTailwind = () => {
  return new Promise<void>((resolve) => {
    if (!global.tw) {
      global.tw = {
        built: false,
        process: execa(
          join(dirs.pkgs.main, 'node_modules', '.bin', 'tailwindcss'),
          [
            '--watch',
            '--jit',
            '--minify',
            '-v',
            '-i',
            join(dirs.pkgs.docs, 'src', 'index.css'),
            '-o',
            join(dirs.pkgs.docs, 'public', 'index.css'),
          ],
          {
            all: true,
            cwd: join(dirs.pkgs.docs),
          }
        ),
      }

      let built = false
      global.tw.process.all?.pipe(
        new Writable({
          write: (d, e, c) => {
            if (d.toString('utf-8').indexOf('Done') >= 0) {
              if (!built) {
                resolve()
                built = true
              }
            }
            c()
          },
        })
      )
    } else {
      resolve()
    }
  })
}
