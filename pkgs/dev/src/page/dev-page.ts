import { FastifyReply, FastifyRequest } from 'fastify'
import { PlatformGlobal } from 'platform/src/types'

declare const global: PlatformGlobal

export const devRoutePage = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { action, id } = req.params as { action: string; id: string }

  switch (action) {
    case 'list':
      {
        reply.send(
          Object.values(global.cache.page).map((e) => {
            return {
              id: e.id,
              lid: e.layout_id,
              name: e.name,
              url: e.url,
            }
          })
        )
      }
      break
    case 'code':
      {
        const page = global.cache.page[id]
        if (id && page) {
          reply.send({
            status: 'ok',
            code: page.jsx.raw,
          })
          return
        }
        reply.send({ status: 'failed' })
      }
      break

    case 'compiled':
      {
        const page = global.cache.page[id]
        if (id && page) {
          reply.send({
            status: 'ok',
            code: page.jsx.code,
          })
          return
        }
        reply.send({ status: 'failed' })
      }
      break
  }
}
