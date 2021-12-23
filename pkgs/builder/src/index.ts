import { pathExists, readJSON } from 'libs/fs'

export * from './builder'
export * from './builderpool'
export * from './thread'
export * from './watcher'

export interface BuilderGlobal {
  mode: 'dev' | 'prod'
}

export const getDeps = async (pkg: string) => {
  if (await pathExists(pkg)) {
    const json = await readJSON(pkg)
    if (json && json.dependencies) {
      return Object.keys(json.dependencies)
    }
  }
}
