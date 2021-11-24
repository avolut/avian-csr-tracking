import arg from 'arg'
import { build } from 'esbuild'
import { pathExists, readJSON, remove, writeJSON } from 'fs-extra'
import { aliasLoader } from 'main/src/utils/aliasLoader'
import { join } from 'path'
import { parentPort } from 'worker_threads'
import { readDeps } from './dev/install-deps'
import { dirs, log } from './main'
import { welcomeToBase } from './utils/logging'

const main = async () => {
  const rootstamp = new Date().getTime()
  const args = arg({
    '--port': Number,
  })
  const mode = (args._[0] || 'dev') as 'dev' | 'prod'
  const port = args['--port'] || 3200

  welcomeToBase(mode, port)

  // make sure builder is built first
  if (
    true ||
    !(await pathExists(join(dirs.pkgs.builder, 'build', 'index.js')))
  ) {
    await build({
      entryPoints: [join(dirs.pkgs.builder, 'src', 'index.ts')],
      outfile: join(dirs.pkgs.builder, 'build', 'index.js'),
      bundle: true,
      logLevel: 'silent',
      loader: {
        '.node': 'binary',
      },
      external: readDeps(dirs.pkgs.builder),
      platform: 'node',
      format: 'cjs',
    })

    const json = await readJSON(join(dirs.pkgs.builder, 'package.json'))
    json.main = './build/index.js'
    await writeJSON(join(dirs.pkgs.builder, 'package.json'), json, {
      spaces: 2,
    })
  }

  // start main boot
  const start = async (importBuilder) => {
    const { BuilderPool } = importBuilder
    const pool = new BuilderPool()

    log('boot', 'Builder', false)
    let mainReady = false

    pool.onParentMessage(async (msg) => {
      if (msg === 'ready') mainReady = true
    })

    await pool.add('base', {
      in: join(dirs.pkgs.boot, 'src', 'base.ts'),
      out: join(dirs.root, 'base.js'),
      watch: [join(dirs.pkgs.boot, 'src')],
      buildOptions: {
        external: ['esbuild'],
        minify: true,
        treeShaking: true,
        bundle: true,
      },
      metafile: false,
      onChange:
        mode === 'prod'
          ? undefined
          : async (event, fullPath, builder) => {
              if (parentPort) {
                await pool.rebuild('base')
                await pool.destroy()
                await remove(join(dirs.pkgs.boot, 'build'))
                parentPort.postMessage('restart')
              } else {
                await remove(join(dirs.pkgs.boot, 'build'))
                console.log(`\n\n Please run: node base`)
                process.exit(0)
              }
            },
    })

    await pool.add('builder', {
      in: join(dirs.pkgs.builder, 'src', 'index.ts'),
      out: join(dirs.pkgs.builder, 'build', 'index.js'),
      watch: mode === 'prod' ? undefined : [join(dirs.pkgs.builder, 'src')],
      external: readDeps(dirs.pkgs.builder),
      onChange:
        mode === 'prod'
          ? undefined
          : async (event, file, builder) => {
              welcomeToBase(mode, port)
              const res = await pool.rebuild('builder')
              await pool.destroy()
              delete require.cache['builder']

              if (res) {
                const out = join(
                  dirs.root,
                  Object.keys(res.metafile.outputs)[0]
                )
                delete require.cache[out]
                start(require(out))
              }
            },
    })

    await pool.add('boot', {
      in: join(dirs.pkgs.main, 'src', 'index.ts'),
      out: join(dirs.pkgs.main, 'build', 'index.js'),
      external: readDeps(dirs.pkgs.main),
      buildOptions: {
        metafile: true,
      },
      onChange:
        mode === 'prod'
          ? undefined
          : async () => {
              welcomeToBase(mode, port)
              log('boot', 'Builder', false)
              await pool.rebuild('boot')
            },
      onBuilt: () => {
        pool.run('boot', { mode, port, rootstamp })
      },
    })

    // run main from boot
    process.stdout.write(` • Main`)
  }
  start(require('builder'))
}

main()
