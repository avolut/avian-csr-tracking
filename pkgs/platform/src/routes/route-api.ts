import { FastifyReply, FastifyRequest } from 'fastify'
import { matchRoute } from 'libs'
import { loadSession } from 'src/session/session-loader'
import { PlatformGlobal } from 'src/types'
import { api } from 'web-utils/src/api'

import { ext as extServer } from 'server'
const ext =
  extServer && (extServer as any).default
    ? (extServer as any).default
    : extServer

declare const global: PlatformGlobal

export const routeAPI = async ({
  url,
  req,
  reply,
}: {
  url: string
  req: FastifyRequest
  reply: FastifyReply
}) => {
  for (let page of Object.values(global.cache.api)) {
    if (page.url) {
      if (page && page.serverOnLoad) {
        const params = matchRoute(url, page.url)
        if (params && page.serverOnLoad) {
          const session = await loadSession(req, reply)
          try {
            await page.serverOnLoad({
              template: null,
              params: params,
              render: async (_template, _params) => {
                reply.send(_params)
              },
              db: global.db,
              req,
              reply,
              user: session.user,
              ext,
              api,
              isDev: global.mode === 'dev',
              log: console.log,
            })
          } catch (e: any) {
            console.log(`\
Error: 
${page.serverOnLoad.toString()}   

message: ${e}`)
          }
          return true
        }
      }
    }
  }
  return false
}
