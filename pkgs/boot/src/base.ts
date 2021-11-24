import arg from 'arg'
import { pathExists, write, writeFile } from 'fs-extra'
import { join } from 'path'
import { installDeps } from './dev/install-deps'
import { removeDeps } from './dev/remove-deps'
import { dirs } from './main'
import { startBase } from './utils/start-base'
;(async () => {
  try {
    // parse args
    const args = arg({
      '--port': Number,
    })
    const _ = args._
    const mode = _[0] || 'dev'

    // install pnpm dependencies if not exists
    if (!(await pathExists(join(dirs.root, 'node_modules')))) {
      await installDeps()
    }

    // start the engine!
    switch (mode) {
      case 'dev':
        await startBase()
        break
      case 'prod':
        await startBase()
        break
      case 'i':
      case 'install':
      case 'add':
        try {
          await installDeps(_.slice(1))
        } catch (e) {}
        break
      case 'r':
      case 'rm':
      case 'remove':
      case 'uninstall':
      case 'delete':
        try {
          await removeDeps(_.slice(1))
        } catch (e) {}
        break
    }
  } catch (e) {
    console.log(e.message)
  }
})()
