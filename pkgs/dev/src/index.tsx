import { ServerInstance } from 'platform/src/server'
import { PlatformGlobal } from 'platform/src/types'
import { broadcastHMR, devHMRRoute, devHMRWsRoute } from './dev-hmr'

declare const global: PlatformGlobal

export const startDev = async (
  server: ServerInstance,
) => {
  global.dev = {
    broadcast: broadcastHMR,
  } as any

  try {
    server.get('/__hmr', { websocket: true }, devHMRWsRoute as any)
    server.get('/__hmr/*', devHMRRoute)
  } catch (e) {}
}
