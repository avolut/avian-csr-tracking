import { FastifyReply, FastifyRequest } from 'fastify'
import { matchRoute } from 'libs'
import { loadSession } from 'src/session/session-loader'
import { api } from 'web-utils/src/api'

import { ext as extServer } from 'server'
const ext =
  extServer && (extServer as any).default
    ? (extServer as any).default
    : extServer

export const routeParams = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as { id: string }
  const page = global.cache.page[params.id]
  if (page && page.serverOnLoad && req.body && (req.body as any).url) {
    const url = (req.body as any).url
    const params = matchRoute(url, page.url)

    if (params && page.serverOnLoad) {
      const session = await loadSession(req, reply)
      await page.serverOnLoad({
        template: null,
        params: params,
        render: async (_template, _params) => {
          reply.send(_params)
        },
        db: global.db,
        req,
        reply,
        user: session,
        ext,
        api,
        isDev: global.mode === 'dev',
        log: console.log,
      })
      return
    }
  }

  reply.code(404)
  reply.send('{}')
}
