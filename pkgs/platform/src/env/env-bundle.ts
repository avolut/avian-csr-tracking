import { PlatformGlobal } from 'src/types'

declare const global: PlatformGlobal
export const bundleEnv = async () => {
  global.bundle = {
    public: global.bin.lmdb.open({
      path: global.buildPath.bundle.public,
      compression: true,
      maxDbs: 20,
      noMemInit: true,
      useVersions: false,
    }),
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
