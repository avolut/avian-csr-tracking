import { FastifyReply, FastifyRequest } from 'fastify'
import { PlatformGlobal } from 'src/types'
declare const global: PlatformGlobal

export const routeComponent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const params = req.params as { id: string }
  if (params.id.endsWith('.js')) {
    const id = params.id.substring(0, params.id.length - 3)
    const component = global.cache.component[id]
    if (component && component.jsx) {
      reply.send(component.jsx.code)
    } else {
      reply.send('null')
    }
  }
  return
}
