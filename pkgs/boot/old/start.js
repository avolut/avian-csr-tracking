import { build } from 'esbuild'
import { dirs, log } from '../main'
import { join } from 'path'
import arg from 'arg'
import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp'
import { pathExists, readJSON, readJSONSync, writeJSON } from 'fs-extra'
import chalk from 'chalk'

const readDeps = (pkgdir) => {
  const pkg = join(pkgdir, 'package.json')
  const json = readJSONSync(pkg)
  return Object.keys(json.dependencies) || []
}

const welcomeToBase = (mode) => {
  process.stdout.write('\u001b[3J\u001b[2J\u001b[1J')
  console.clear()

  console.log(
    chalk.gray(`[ ${chalk.bold(`    ANDRO ${chalk.green('Base')}`)}      ]`) +
      ` ${mode === 'dev' ? 'Development' : `Production [Port ${port}]`}`
  )
}

const main = async () => {
  const rootstamp = new Date().getTime()
  const args = arg({
    '--port': Number,
  })
  const mode = args._[0]
  const port = args['--port'] || 3200

  welcomeToBase(mode)

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
      plugins: [pnpPlugin()],
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

    await pool.add('builder', {
      in: join(dirs.pkgs.builder, 'src', 'index.ts'),
      out: join(dirs.pkgs.builder, 'build', 'index.js'),
      watch: mode === 'prod' ? undefined : [join(dirs.pkgs.builder, 'src')],
      external: readDeps(dirs.pkgs.builder),
      onChange:
        mode === 'prod'
          ? undefined
          : async (event, file, builder) => {
              welcomeToBase(mode)
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
              welcomeToBase(mode)
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
