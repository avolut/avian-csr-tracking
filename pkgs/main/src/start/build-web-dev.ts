import { dirs, log } from 'boot'
import { BuilderPool } from 'builder'
import { OutputFile } from 'esbuild'
import execa from 'execa'
import { lstat, pathExists, readFile, readJSON, remove } from 'fs-extra'
import klaw from 'klaw'
import { join } from 'path'
import { aliasLoader } from 'src/utils/aliasLoader'
import { cssLoader } from 'src/utils/cssLoader'
import { Stream } from 'stream'
import { publicBundle } from '../bundler/public/public'
import { MainGlobal } from '../start'
import { webFiles, webPkgs } from '../utils/devFiles'
import { ensureProject } from '../utils/ensureProject'
import { overrideWebIndex } from '../utils/overrideWebIndex'
import { runPnpm } from '../utils/pnpm'
import { baseTypeFiles } from './build-dev'
declare const global: MainGlobal

export const buildWebDev = async (pool: BuilderPool, mode: 'dev' | 'prod') => {
  return new Promise<void>(async (resolve) => {
    if (!(await pathExists(join(dirs.app.web, 'disabled')))) {
      process.stdout.write(' • Web')

      if (
        (await pathExists(publicBundle.path)) &&
        (await lstat(publicBundle.path)).size > 50 * 1000 * 1024
      ) {
        await remove(publicBundle.path)
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
          pure: ['getNodeInfo'],
          sourcemap: true,
          splitting: true,
          keepNames: true,
          metafile: true,
          write: false,
          treeShaking: true,
          outdir: join(dirs.app.web, 'build', 'web'),
          external: ['@emotion/react', 'stream', 'util', 'zlib'],
          target: 'es6',
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
          if (result.outputFiles) {
            const outputFiles: OutputFile[] = Object.values(result.outputFiles)

            if (
              publicBundle.db.items.raw.public.doesExist(
                'app/web/build/web/old/index.js'
              )
            ) {
              publicBundle.db.items.raw.public.clear()
            }

            // app/web/build
            await Promise.all(
              outputFiles.map((item) => {
                const path = item.path.substring(dirs.root.length + 1)
                return publicBundle.db.save('public', path, item.contents)
              })
            )

            await bundlePublicExtra()

            if (reloading) {
              pool.send('platform', `reload|all|public`)
              process.stdout.write(` [DONE]\n`)
            }
          }
          resolve()
        },
      })
    }
  })
}

export const bundlePublicExtra = async () => {
  let warnLargeIntro = false
  const warnLarge = (path: string, size: number) => {
    // if (extname(path) !== '.map' && size > 1024 * 500) {
    //   if (!warnLargeIntro) {
    //     console.log('')
    //     console.log('Warning large files:')
    //     warnLargeIntro = true
    //   }
    //   console.log(`  • ${pad(path, 75)} [${formatBytes(size)}]`)
    // }
  }

  await Promise.all([
    // app/web/figma/imgs
    new Promise((resolve) => {
      klaw(join(dirs.app.web, 'figma', 'imgs'))
        .on('data', async (item) => {
          if (!item.stats.isFile()) return
          const path = item.path.substr(
            join(dirs.pkgs.web, 'figma', 'imgs').length
          )
          const file = await readFile(item.path)
          warnLarge(`app/web/figma/imgs/${path}`, file.byteLength)

          publicBundle.db.save('public', 'app/web/figma/imgs/' + path, file)
        })
        .on('end', resolve)
    }),

    // app/web/public
    new Promise((resolve) => {
      klaw(join(dirs.app.web, 'public'))
        .on('data', async (item) => {
          if (!item.stats.isFile()) return
          const path = item.path.substr(join(dirs.pkgs.web, 'public').length)
          const file = await readFile(item.path)
          warnLarge(`app/web/public/${path}`, file.byteLength)
          publicBundle.db.save('public', 'app/web/build/web/' + path, file)
        })
        .on('end', resolve)
    }),

    // pkgs/web/ext
    new Promise((resolve) => {
      klaw(join(dirs.pkgs.web, 'ext'))
        .on('data', async (item) => {
          if (!item.stats.isFile()) return
          const path = item.path.substr(join(dirs.pkgs.web, 'ext/').length)
          const file = await readFile(item.path)
          warnLarge(`pkgs/web/ext/${path}`, file.byteLength)
          publicBundle.db.save('public', `pkgs/web/ext/${path}`, file)
        })
        .on('end', resolve)
    }),
  ])
}

function formatBytes(bytes: number, decimals?: number) {
  if (bytes == 0) return '0 Bytes'
  var k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
export class TailwindExportStream extends Stream.Writable {
  buffer = ''
  compressTimeout = 0
  _write(chunk, enc, next) {
    const text = chunk.toString()
    if (text.startsWith('/*! tailwindcss ')) {
      this.buffer = ''
    }
    this.buffer += text
    const target = 'app/web/build/web/index.css'
    publicBundle.db.items.raw.public.put(target, this.buffer)

    if (this.compressTimeout) {
      clearTimeout(this.compressTimeout)
    }
    this.compressTimeout = setTimeout(() => {
      const raw = Buffer.from(this.buffer)
      publicBundle.db.compressSingle('public', target, raw)
    }, 100)

    next()
  }
}

const runTailwind = () => {
  const tw = execa(
    join(dirs.pkgs.main, 'node_modules', '.bin', 'tailwindcss'),
    [
      '--watch',
      '--jit',
      '--minify',
      '-i',
      join(dirs.app.web, 'src', 'index.css'),
    ],
    {
      cwd: join(dirs.app.web),
    }
  )

  tw.stdout?.pipe(new TailwindExportStream())
}
