const { join } = require('path')
const { build } = require('esbuild')
const { readJSONSync, remove, pathExists } = require('fs-extra')
const { parentPort } = require('worker_threads')

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
      format: 'cjs',
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
      format: 'cjs',
    })
  }

  if (parentPort) {
    parentPort.addListener('message', async (msg) => {
      switch (true) {
        case msg.startsWith('start'):
          await rebuild()
          delete require.cache[join(boot, 'build', 'start.js')]
          require(join(boot, 'build', 'start.js'))
          break
      }
    })
  } else {
    await remove(join(root, 'pkgs', 'dev', 'build'))
    await remove(join(root, 'pkgs', 'main', 'build'))
    await remove(join(root, 'pkgs', 'platform', 'build'))
    await remove(join(root, 'build', 'pkgs', 'build.meta.json'))

    await rebuild()
    delete require.cache[join(boot, 'build', 'start.js')]
    require(join(boot, 'build', 'start.js'))
  }
})()
