import arg from 'arg'
import { join } from 'path'
import { installDeps } from './dev/install-deps'
import { removeDeps } from './dev/remove-deps'
import { dirs } from './main'
import { basePush } from './utils/base-push'
import { cleanBuild } from './utils/clean-build'
import { dbIndex } from './utils/db-index'
import { startBase } from './utils/start-base'
;(async () => {
  const { pathExists } = await import('libs/fs')
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
      case 'clean':
        await cleanBuild()
        break

      case 'push':
        await basePush(_)
        break

      case 'db':
        await dbIndex(_.slice(1))
        break

      case 'dev':
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
  } catch (e: any) {
    console.log(e.message)
  }
})()
