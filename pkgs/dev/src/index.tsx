import { ServerInstance } from 'platform/src/server'
import { PlatformGlobal } from 'platform/src/types'
import { broadcastHMR, devHMRRoute, devHMRWsRoute } from './dev-hmr'

export * from './base-type/checkBaseType'
export * from './base-type/genTypeExternal'
export * from './base-type/genTypeGlobal'
export * from './migrate/toV1/parse-jsx'
export * from './migrate/toV1/start-migrate'
export * from './migrate/toV1/upgrade-component'
export * from './migrate/toV2/start-migrate'
export * from './migrate/toV2/upgrade-components'
export * from './migrate/toV3/start-migrate'

declare const global: PlatformGlobal

export const startDev = async (server: ServerInstance) => {
  global.dev = {
    broadcast: broadcastHMR,
  } as any

  try {
    server.get('/__hmr', { websocket: true }, devHMRWsRoute as any)
    server.get('/__hmr/*', devHMRRoute)
  } catch (e) {}
}
