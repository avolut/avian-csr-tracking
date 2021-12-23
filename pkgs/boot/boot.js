import differenceInHours from 'date-fns/differenceInHours/index.js'
import differenceInMonths from 'date-fns/differenceInMonths/index.js'
import { build } from 'esbuild'
import fs from 'fs-extra'
import { join } from 'path'
import { parentPort } from 'worker_threads'

const { readJSONSync, remove } = fs

const root = join(process.cwd())
const boot = join(root, 'pkgs', 'boot')

const readDeps = (pkgdir) => {
  const pkg = join(pkgdir, 'package.json')
  const json = readJSONSync(pkg)
  return Object.keys(json.dependencies) || []
}

;(async () => {
  const rebuild = async () => {
    await build({
      entryPoints: [join(root, 'pkgs', 'builder', 'src', 'index.ts')],
      outdir: join(root, 'pkgs', 'builder', 'build'),
      bundle: true,
      loader: {
        '.node': 'binary',
      },
      allowOverwrite: true,
      external: readDeps(join(root, 'pkgs', 'builder')),
      platform: 'node',
      target: 'node' + process.versions.node,
      format: 'cjs',
    })
    await build({
      entryPoints: [join(boot, 'src', 'main.ts')],
      outfile: join(boot, 'build', 'main.js'),
      bundle: true,
      logLevel: 'silent',
      loader: {
        '.node': 'binary',
      },
      allowOverwrite: true,
      external: readDeps(boot),
      platform: 'node',
      target: 'node' + process.versions.node,
      format: 'esm',
    })
    await build({
      entryPoints: [join(boot, 'src', 'start.ts')],
      outfile: join(boot, 'build', 'start.js'),
      bundle: true,
      logLevel: 'silent',
      loader: {
        '.node': 'binary',
      },
      allowOverwrite: true,
      external: readDeps(boot),
      platform: 'node',
      target: 'node' + process.versions.node,
      format: 'esm',
    })
  }

  if (!(await fs.pathExists(join(root, 'app', 'base.version')))) {
    await fs.writeFile(join(root, 'app', 'base.version'), `3.0`)
  }

  if (parentPort) {
    parentPort.addListener('message', async (msg) => {
      switch (true) {
        case msg.startsWith('start'):
          await rebuild()
          await import(join(boot, 'build', 'start.js'))
          break
      }
    })
  } else {
    const tstamp = 1637877284791
    const month = differenceInMonths(new Date(), tstamp) + 1
    const hours = differenceInHours(new Date(), tstamp)
    await fs.writeFile(join(root, 'pkgs', 'base.version'), `3.${month}${hours}`)

    if (!(await fs.pathExists(join(root, 'app', 'base.version')))) {
      await fs.writeFile(join(root, 'app', 'base.version'), `3.0`)
    }

    await remove(join(root, 'pkgs', 'dev', 'build'))
    await remove(join(root, 'pkgs', 'main', 'build'))
    await remove(join(root, 'pkgs', 'platform', 'build'))
    await remove(join(root, 'build', 'pkgs', 'build.meta.json'))
    await rebuild()

    await import(join(boot, 'build', 'start.js'))
  }
})()
