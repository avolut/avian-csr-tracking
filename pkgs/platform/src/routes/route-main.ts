import { FastifyReply, FastifyRequest } from 'fastify'
import { PlatformGlobal } from 'src/types'
import { streamMain } from './route-main-ssr'

declare const global: PlatformGlobal

export const routeMain = async ({
  url,
  req,
  reply,
}: {
  url: string
  req: FastifyRequest
  reply: FastifyReply
}) => {
  if (req.headers.accept && req.headers.accept.indexOf('html') >= 0) {
    reply.type('text/html')
    await prepareBody(req, reply, url)
    return true
  }

  reply.code(404)
  if (req.method === 'GET') {
    await prepareBody(req, reply, url)
    return true
  } else {
    reply.type('application/json')
    reply.send('{"status": "404 - NOT FOUND"}')
    return true
  }
}

const prepareBody = async (
  req: FastifyRequest,
  reply: FastifyReply,
  url: string
) => {
  streamMain(req, reply, url)
}
