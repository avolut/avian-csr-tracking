import { dirs, log } from 'boot'
import hasCommand from 'command-exists'
import execa from 'execa'
import { readJSONSync } from 'fs-extra'
import { join } from 'path'
import { EXECA_FULL_COLOR, logo } from '../utils/logging'

export const readDeps = (pkgdir) => {
  const pkg = join(pkgdir, 'package.json')
  const json = readJSONSync(pkg)
  return Object.keys(json.dependencies) || []
}

export const installDeps = async (args?: string[]) => {
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
        log(workspace, `Installing: ${args.slice(1).join(' ')} \n`)
      } else {
        log('web-app', `Installing: ${args.join(' ')} \n`)
      }

      await execa('pnpm', ['i', ...args], {
        ...EXECA_FULL_COLOR,
        cwd: pkgDir,
      })

      return true
    } else {
      log('boot', 'Preparing dependencies...\n\n')
      await execa('pnpm', ['i'], EXECA_FULL_COLOR)
    }
    return true
  } else {
    log('error', 'Failed to install pnpm')
  }
  return false
}
