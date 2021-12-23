import { readdir, remove } from 'libs/fs'
import { join } from 'path'
import { dirs, log } from '../main'

export const cleanBuild = async () => {
  log('boot', 'Cleaning all build directory...')

  const rm = [] as any
  rm.push(remove(dirs.build))

  for (let [k, v] of Object.entries(dirs.app)) {
    rm.push(remove(join(v, 'build')))
    if (k === 'db') rm.push(remove(join(v, 'node_modules')))
  }

  for (let [k, v] of Object.entries(dirs.pkgs)) {
    if (k !== 'web') {
      rm.push(remove(join(v, 'build')))
    } else {
      const webDirs = await readdir(v)
      for (let d of webDirs) {
        rm.push(remove(join(v, d, 'build')))
      }
    }
  }

  await Promise.all(rm)
}
