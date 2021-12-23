import { PlatformGlobal } from 'src/types'

declare const global: PlatformGlobal
export const bundleEnv = async () => {
  global.bundle = {
    base: global.bin.lmdb.open({
      path: global.buildPath.bundle.base,
      compression: true,
      maxDbs: 5,
      noMemInit: true,
      useVersions: false,
    }),
    session: global.bin.lmdb.open({
      path: global.buildPath.bundle.session,
      compression: true,
      maxDbs: 3,
      noMemInit: true,
      useVersions: false,
    }),
  }
}
