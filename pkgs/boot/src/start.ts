import arg from 'arg'
import { build } from 'esbuild'
import { readFile, writeFile } from 'libs/fs'
import { join } from 'path'
import { parentPort } from 'worker_threads'
import type * as builderpool from '../../builder/src/builderpool'
import { readDeps } from './dev/install-deps'
import { dirs } from './main'
import { timelog, welcomeToBase } from './utils/logging'

const main = async () => {
  const { pathExists, readJson, remove, writeJSON } = await import('libs/fs')

  const rootstamp = new Date().getTime()
  const args = arg({
    '--port': Number,
  })
  const mode = (args._[0] || 'dev') as 'dev' | 'prod'

  let docs = false
  if ((mode as any) === 'docs') {
    docs = true
  }

  const port = args['--port'] || 3200

  welcomeToBase(mode, port)

  const done = timelog('boot', 'Booting')

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
      external: await readDeps(dirs.pkgs.builder),
      platform: 'node',
      format: 'esm',
    })

    const json = await readJson(join(dirs.pkgs.builder, 'package.json'))
    json.main = './build/index.js'
    await writeJSON(join(dirs.pkgs.builder, 'package.json'), json, {
      spaces: 2,
    })
  }

  // start main boot
  const start = async (importBuilder: typeof builderpool) => {
    const { BuilderPool } = importBuilder
    const pool = new BuilderPool()

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
        // minify: true,
        // treeShaking: true,
        bundle: true,
        format: 'esm',
        target: 'node' + process.versions.node,
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
      onBuilt: async () => {
        const source = await readFile(join(dirs.root, 'base.js'), 'utf-8')

        if (!source.startsWith(`import { createRequire } from 'module'`)) {
          await writeFile(
            join(dirs.root, 'base.js'),
            `\
import { createRequire } from 'module';const require = createRequire(import.meta.url);
      ${source}`
          )
        }
      },
    })

    await pool.add('libs', {
      root: dirs.pkgs.libs,
      in: join(dirs.pkgs.libs, 'src', 'index.tsx'),
      out: join(dirs.pkgs.libs, 'build', 'index.js'),
      buildOptions: {
        target: 'node16',
        format: 'esm',
      },
    })

    await pool.add('dev', {
      root: dirs.pkgs.dev,
      in: join(dirs.pkgs.dev, 'src', 'index.tsx'),
      out: join(dirs.pkgs.dev, 'build', 'index.js'),
      buildOptions: {
        target: 'node16',
        format: 'esm',
      },
    })

    await pool.add('boot', {
      in: join(dirs.pkgs.main, 'src', 'index.ts'),
      out: join(dirs.pkgs.main, 'build', 'index.js'),
      external: await readDeps(dirs.pkgs.main),
      buildOptions: {
        metafile: true,
        format: 'esm',
      },
      onChange:
        mode === 'prod'
          ? undefined
          : async () => {
              welcomeToBase(mode, port)
              await pool.rebuild('boot')
            },
      onBuilt: async () => {
        pool.run('boot', { mode, port, rootstamp, docs })
      },
    })

    done()
  }

  const builder = await import(join(dirs.root, 'pkgs/builder/build/index.js'))
  start(builder)
}


main()
