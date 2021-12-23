import { dirs } from 'boot'
import { FastifyReply, FastifyRequest } from 'fastify'
import { pathExists, readFile } from 'libs/fs'
import mime from 'mime-types'
import { join } from 'path'

export const routeDocs = async (req: FastifyRequest, reply: FastifyReply) => {
  let url = req.url.substring('/__docs'.length)

  if (url === '' || url === '/') {
    url = '/index.html'
  }

  const path = join(dirs.pkgs.docs, 'public', url)
  if (await pathExists(path)) {
    reply.type(mime.lookup(url))
    reply.send(await readFile(path))
    return
  }
  reply.code(404)
  reply.send('File not found')
}
