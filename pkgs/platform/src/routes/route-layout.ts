import { FastifyReply, FastifyRequest } from 'fastify'
import { waitUntil } from 'libs'

export const routeLayout = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as { id: string; ext: 'js' | 'js.map' }
  const layout = global.cache.layout[params.id]
  if (layout) {
    if (!layout.jsx) {
      await waitUntil(() => !!layout.jsx)
    }
    if (params.ext === 'js') {
      const sourceMapUrl = req.url + '.map'
      reply.header('SourceMap', sourceMapUrl)
      reply.type('application/javascript')
      reply.send(layout.jsx.code + `\n\n//# sourceMappingURL=${sourceMapUrl}`)
      return
    } else if (params.ext === 'js.map') {
      reply.type('application/json')
      reply.send(layout.jsx.map)
      return
    }
  }

  reply.code(404)
  reply.send('404 Not Found')
}
