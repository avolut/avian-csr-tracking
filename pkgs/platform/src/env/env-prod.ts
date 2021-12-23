import { log } from 'boot'
import { timelog } from 'boot/src/utils/logging'
import { ensureDir, writeFile } from 'libs/fs'
import { join } from 'path'
import { PlatformGlobal } from 'src/types'

declare const global: PlatformGlobal

export const prodEnv = async () => {
  const external = (await import('../../../../app/web/src/external')).default
  const mobile = (
    await import('../../../web/init/src/mobile/mobile-ext')
  ).extendExternals()

  const blankComponents = [...Object.keys(external), ...Object.keys(mobile)]

  await ensureDir(join(global.buildPath.public, '__component'))

  const components = Object.entries(global.cache.component)

  // let done = timelog(
  //   'platform.prod',
  //   `Generating ${blankComponents.length + components.length} components`
  // )

  for (let v of blankComponents) {
    await writeFile(
      join(global.buildPath.public, '__component', `${v}.js`),
      'null'
    )
  }

  for (let [k, v] of components) {
    if (v.jsx)
      await writeFile(
        join(global.buildPath.public, '__component', `${k}.js`),
        v.jsx.code
      )
  }
  // done()
}
