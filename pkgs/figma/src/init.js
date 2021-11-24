const { log } = require('boot')
const chokidar = require('chokidar')
const { build } = require('esbuild')
const {
  ensureDir,
  readFile,
  writeFile,
  remove,
  pathExists,
} = require('fs-extra')
const { join } = require('path')

const root = join(process.cwd(), 'pkgs', 'figma')
const dirs = {
  root,
  ui: join(root, 'src', 'ui'),
  plugin: join(root, 'src', 'plugin'),
  build: join(root, 'bin'),
}

const plugin = async () => {
  const rebuild = async () => {
    const outfile = join(dirs.build, 'plugin.js')
    await build({
      entryPoints: [join(dirs.plugin, 'plugin.ts')],
      outfile,
      bundle: true,
      // logLevel: 'silent',
      platform: 'browser',
      minify: true,
      keepNames: true,
      treeShaking: true,
      format: 'iife',
      target: 'es6',
      nodePaths: [join(dirs.root, 'node_modules')],
    })

    //     let out = await readFile(outfile, 'utf-8')

    //     out = out.substr(0, out.length - 6)
    //     await writeFile(outfile, `${out}

    // setTimeout(() => {
    //   console.log(glbo)
    // })

    // })();
    // `)

    manifest()
    log('Plugin', 'Rebuilt')
  }
  const watcher = chokidar.watch(dirs.plugin, {
    ignoreInitial: true,
  })
  watcher.on('all', async () => {
    await rebuild()
  })
  await rebuild()
}

const ui = async () => {
  const rebuild = async () => {
    await build({
      entryPoints: {
        ui: join(dirs.ui, 'ui.tsx'),
      },
      outdir: dirs.build,
      // outfile: join(dirs.build, 'ui.js'),
      bundle: true,
      loader: {
        '.ttf': 'file',
      },
      // logLevel: 'silent',
      pure: ['getNodeInfo'],
      platform: 'browser',
      minify: true,
      treeShaking: true,
      format: 'iife',
      nodePaths: [join(dirs.root, 'node_modules')],
    })

    const src = await readFile(join(dirs.build, 'ui.js'), 'utf-8')
    let html = await readFile(join(dirs.ui, 'ui.html'), 'utf-8')

    html = html.split(`;[script]`)

    const final = `${html[0]}${src}${html[1]}`.replace(
      '[url]',
      `http://${require('./host')}`
    )

    await remove(join(dirs.build, 'ui.js'))
    await writeFile(join(dirs.build, 'ui.html'), final)

    manifest()
    log('UI', 'Rebuilt')
  }
  const watcher = chokidar.watch(dirs.ui, {
    ignoreInitial: true,
  })
  watcher.on('all', async () => {
    await rebuild()
  })
  await rebuild()
}

const start = async () => {
  await remove(dirs.build)
  console.log('Starting Figma Base Development')
  ui()
  plugin()
}
start()

const manifest = async () => {
  if (!(await pathExists(join(dirs.build, 'manifest.json')))) {
    await writeFile(
      join(dirs.build, 'manifest.json'),
      JSON.stringify(
        {
          api: '1.0.0',
          id: 'andro-figma-base',
          name: 'Figma Base',
          main: 'plugin.js',
          ui: 'ui.html',
          editorType: ['figma'],
          enablePrivatePluginApi: true,
          relaunchButtons: [{ command: 'open', name: 'Open Figma Base' }],
        },
        null,
        2
      )
    )
  }
}
