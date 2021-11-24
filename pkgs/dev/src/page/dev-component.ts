import { FastifyReply, FastifyRequest } from 'fastify'
import { PlatformGlobal } from 'platform/src/types'

declare const global: PlatformGlobal

export const devRouteComponent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { action, id } = req.params as { action: string; id: string }

  switch (action) {
    case 'list':
      {
        reply.send(
          Object.entries(global.cache.component).map(([name, content]) => {
            return {
              name,
            }
          })
        )
      }
      break
  }
}
