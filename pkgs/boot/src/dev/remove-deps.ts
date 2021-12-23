import { dirs, log } from '../main'
import hasCommand from 'command-exists'
import execa from 'execa'
import { join } from 'path'
import { EXECA_FULL_COLOR, logo } from '../utils/logging'

export const removeDeps = async (args?: string[]) => {
  console.log(logo() + ` Welcome to base`)
  if (!(await hasCommand('pnpm'))) {
    await execa('npm', ['i', '-g', 'pnpm'], EXECA_FULL_COLOR)
  }

  if (await hasCommand('pnpm')) {
    if (args && args.length > 0) {
      const pnpmList = JSON.parse(
        (await execa('pnpm', ['list', '--json'])).stdout
      )
      const deps = pnpmList[0].dependencies
      const workspace = args[0]

      let pkgDir = dirs.app.web
      if (deps[workspace] && deps[workspace].version) {
        pkgDir = join(dirs.root, deps[workspace].version.substr('link:'.length))
        log(workspace, `Removing: ${args.slice(1).join(' ')} \n`)
      } else {
        log('web-app', `Removing: ${args.join(' ')} \n`)
      }

      await execa('pnpm', ['remove', ...args], {
        ...EXECA_FULL_COLOR,
        cwd: pkgDir,
      })

      return true
    }
    return true
  } else {
    log('error', 'Failed to install pnpm')
  }
  return false
}
