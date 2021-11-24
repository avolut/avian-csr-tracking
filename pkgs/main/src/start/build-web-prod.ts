import { dirs, log } from 'boot'
import { BuilderPool } from 'builder'
import esbuild from 'esbuild'
import execa from 'execa'
import { pathExists, readFile, remove } from 'fs-extra'
import klaw from 'klaw'
import { padEnd } from 'lodash'
import MemoryFS from 'memory-fs'
import { join } from 'path'
import { publicBundle } from 'src/bundler/public/public'
import { aliasLoader } from 'src/utils/aliasLoader'
import { cssLoader } from 'src/utils/cssLoader'
import webpack from 'webpack'
import { bundlePublicExtra, TailwindExportStream } from './build-web-dev'

export const buildWebProd = async (pool: BuilderPool, mode: 'dev' | 'prod') => {
  process.stdout.write(' • Web\n')

  if (await pathExists(join(dirs.build, 'prod')))
    await remove(join(dirs.build, 'prod'))
  try {
    log('prod', padEnd('Running ESBuild', 30, '.'), false)
    await Promise.all([buildProd(), runTailwind()])
    process.stdout.write('[DONE]\n')

    log('prod', padEnd('Bundling', 30, '.'), false)
    await bundle()
    process.stdout.write('[DONE]\n')

    // await publicBundle.db.compressAll('public')
    // process.stdout.write('[DONE]\n')
  } catch (e) {
    console.log('')
    console.error(e)
  }
}

const bundle = async () => {
  await Promise.all([bundlePublicExtra()])
}

const buildProd = async () => {
  const buildResult = await esbuild.build({
    entryPoints: [join(dirs.app.web, 'src', 'index.tsx')],
    platform: 'browser',
    chunkNames: 'chunks/[name]-[hash]',
    splitting: true,
    bundle: true,
    format: 'esm',
    target: 'es6',
    minify: true,
    pure: ['getNodeInfo'],
    treeShaking: true,
    metafile: true,
    outdir: join(dirs.build, 'prod', 'esm'),
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
  })

  klaw(join(dirs.build, 'prod', 'esm')).on('data', async (item) => {
    if (!item.stats.isFile()) return
    const path = item.path.substring(join(dirs.build, 'prod', 'esm').length + 1)
    publicBundle.db.save(
      'public',
      'app/web/build/web/' + path,
      await readFile(item.path)
    )
  })

  process.stdout.write('[DONE]\n')
  log('prod', padEnd('Running Webpack', 30, '.'), false)

  await convertToES5()
}

const runTailwind = async () => {
  const tw = execa(
    join(dirs.pkgs.main, 'node_modules', '.bin', 'tailwindcss'),
    ['--minify', '-i', join(dirs.app.web, 'src', 'index.css')],
    {
      cwd: join(dirs.app.web),
    }
  )

  tw.stdout?.pipe(new TailwindExportStream())
}

export async function convertToES5() {
  return new Promise<void>((resolve) => {
    const fs = new MemoryFS()
    const compiler = webpack({
      mode: 'production',
      target: ['web', 'es5'],
      entry: [join(dirs.build, 'prod', 'esm', 'index.js')],
      output: {
        path: join(dirs.build, 'prod', 'es5'),
        filename: 'index.js',
        asyncChunks: true,
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': 'production',
          'process.env.DEBUG': false,
        }),
      ],
    })

    compiler.outputFileSystem = fs
    compiler.run(function (err, stats) {
      if (err) {
        console.log('')
        console.error(err)
        return true
      }
      if (!!stats?.compilation.errors && stats?.compilation.errors.length > 0) {
        console.log('')
        console.log(stats?.compilation.errors)
        return true
      }
      for (let [path, _] of Object.entries(stats?.compilation.assets || {})) {
        publicBundle.db.save(
          'public',
          'app/web/build/web/old/' + path,
          fs.readFileSync(join(dirs.build, 'prod', 'es5', path))
        )
      }
      resolve()
    })
  })
}
