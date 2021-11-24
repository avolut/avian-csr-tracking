import { FastifyReply, FastifyRequest } from 'fastify'
import { waitUntil } from 'libs'

export const routePage = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as { id: string; ext: 'js' | 'js.map' }
  const page = global.cache.page[params.id]
  if (page) {
    if (!page.jsx) {
      await waitUntil(() => !!page.jsx)
    }
    if (params.ext === 'js') {
      const sourceMapUrl = req.url + '.map'
      reply.header('SourceMap', sourceMapUrl)
      reply.type('application/javascript')
      reply.send(page.jsx.code + `\n\n//# sourceMappingURL=${sourceMapUrl}`)
      return
    } else if (params.ext === 'js.map') {
      reply.type('application/json')
      reply.send(page.jsx.map)
      return
    }
  }

  reply.code(404)
  reply.send('404 Not Found')
}
